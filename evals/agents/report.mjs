// Summarises a run's results.json as Markdown: one row per condition, then each task's passes.
//
//   node report.mjs D:/sveltier-eval/runs/<run>/results.json [more results.json…]
import fs from 'node:fs';
import { TASKS } from './tasks.mjs';

// One or more results.json files, read as one set.
const results = process.argv.slice(2).flatMap((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
const conditions = [...new Set(results.map((r) => r.condition))];
const LABELS = {
	nodocs: 'Types only (docs removed)',
	plain: 'Package docs, no AGENTS.md',
	init: 'Package docs + AGENTS.md',
	next: 'Next: AGENTS.md naming the space scale'
};

const mean = (values) => {
	const numbers = values.filter((v) => typeof v === 'number');
	return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : NaN;
};
const percent = (part, whole) => `${Math.round((100 * part) / whole)}%`;
const fixed = (value, digits = 1) => (Number.isNaN(value) ? '–' : value.toFixed(digits));

const rows = conditions.map((condition) => {
	const runs = results.filter((r) => r.condition === condition);
	const n = runs.length;
	return [
		LABELS[condition] ?? condition,
		n,
		percent(runs.filter((r) => r.behaviour.pass).length, n),
		percent(runs.filter((r) => r.typeCheck.errors === 0).length, n),
		percent(runs.filter((r) => r.build.ok).length, n),
		percent(runs.filter((r) => r.source.uiProvider).length, n),
		runs.reduce((sum, r) => sum + r.source.unknownVariables.length, 0),
		runs.reduce((sum, r) => sum + r.source.svelte4, 0),
		runs.reduce((sum, r) => sum + r.source.fixedColours, 0),
		runs.filter((r) => r.behaviour.sveltierWarnings.length).length,
		fixed(mean(runs.map((r) => r.agent.failedChecks))),
		fixed(mean(runs.map((r) => r.agent.turns))),
		fixed(mean(runs.map((r) => r.agent.seconds)), 0),
		`$${fixed(mean(runs.map((r) => r.agent.costUsd)), 2)}`
	];
});

const table = (head, body) =>
	[
		`| ${head.join(' | ')} |`,
		`| ${head.map(() => '---').join(' | ')} |`,
		...body.map((row) => `| ${row.join(' | ')} |`)
	].join('\n');

let out = `# Agent eval: ${results[0]?.model ?? ''}\n\n`;
out += table(
	[
		'Condition',
		'Runs',
		'Task works',
		'0 type errors',
		'Builds',
		'UIProvider set up',
		'Made-up --sv-* variables',
		'Svelte 4 syntax',
		'Fixed colours',
		'Runs with [sveltier] warnings',
		'Failed checks / run',
		'Turns / run',
		'Seconds / run',
		'Cost / run'
	],
	rows
);

out += '\n\n## Task works, by task\n\n';
out += table(
	['Task', ...conditions.map((c) => LABELS[c] ?? c)],
	TASKS.map((task) => [
		task.id,
		...conditions.map((condition) => {
			const runs = results.filter((r) => r.task === task.id && r.condition === condition);
			return runs.length ? `${runs.filter((r) => r.behaviour.pass).length}/${runs.length}` : '–';
		})
	])
);

out += '\n\n## Failures\n\n';
for (const r of results.filter((r) => !r.behaviour.pass || r.typeCheck.errors || !r.build.ok)) {
	out += `- **${r.task} · ${r.condition}-${r.rep}**: `;
	const parts = [];
	if (!r.behaviour.pass) parts.push(`behaviour: ${r.behaviour.failure?.split('\n')[0]}`);
	if (r.typeCheck.errors) parts.push(`${r.typeCheck.errors} type errors: ${r.typeCheck.first[0]}`);
	if (!r.build.ok) parts.push('build failed');
	out += parts.join('; ') + '\n';
}

const unknown = results.flatMap((r) => r.source.unknownVariables);
if (unknown.length) {
	const counts = Object.entries(
		unknown.reduce((acc, name) => ((acc[name] = (acc[name] ?? 0) + 1), acc), {})
	);
	out +=
		'\n## Made-up variables\n\n' +
		counts
			.sort((a, b) => b[1] - a[1])
			.map(([name, n]) => `- \`${name}\` ×${n}`)
			.join('\n') +
		'\n';
}

const warnings = results.flatMap((r) => r.behaviour.sveltierWarnings);
if (warnings.length) {
	const counts = Object.entries(
		warnings.reduce((acc, code) => ((acc[code] = (acc[code] ?? 0) + 1), acc), {})
	);
	out +=
		'\n## Development warnings seen\n\n' +
		counts.map(([code, n]) => `- ${code} ×${n}`).join('\n') +
		'\n';
}

process.stdout.write(out);
