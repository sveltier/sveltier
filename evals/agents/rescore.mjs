// Scores finished runs again, without running the agent: after a check in tasks.mjs or the scoring
// in score.mjs changes. Keeps the agent's own figures from the first scoring.
//
//   node rescore.mjs D:/sveltier-eval/runs/<run> [--tasks id,id] [--port 5390]
import fs from 'node:fs';
import path from 'node:path';
import { behaviour, build, scan, typeCheck } from './score.mjs';
import { TASKS } from './tasks.mjs';

const [root, ...rest] = process.argv.slice(2);
const option = (name) => {
	const i = rest.indexOf(`--${name}`);
	return i === -1 ? undefined : rest[i + 1];
};
const only = option('tasks')?.split(',');
const port = Number(option('port') ?? 5390);

const results = [];
for (const task of TASKS.filter((t) => !only || only.includes(t.id))) {
	const folder = path.join(root, task.id);
	if (!fs.existsSync(folder)) continue;
	for (const run of fs.readdirSync(folder)) {
		const dir = path.join(folder, run);
		const file = path.join(dir, '.eval-result.json');
		if (!fs.existsSync(file)) continue;
		const previous = JSON.parse(fs.readFileSync(file, 'utf8'));
		const result = {
			...previous,
			typeCheck: await typeCheck(dir),
			build: await build(dir),
			source: await scan(dir),
			behaviour: await behaviour(task, dir, port)
		};
		fs.writeFileSync(file, JSON.stringify(result, null, '\t'));
		console.log(
			`[${task.id} ${run}] pass=${result.behaviour.pass} (was ${previous.behaviour.pass})`
		);
		results.push(result);
	}
}

// Rebuild results.json from every run folder, so it holds the latest scoring of each.
const all = [];
for (const task of TASKS) {
	const folder = path.join(root, task.id);
	if (!fs.existsSync(folder)) continue;
	for (const run of fs.readdirSync(folder)) {
		const file = path.join(folder, run, '.eval-result.json');
		if (fs.existsSync(file)) all.push(JSON.parse(fs.readFileSync(file, 'utf8')));
	}
}
fs.writeFileSync(path.join(root, 'results.json'), JSON.stringify(all, null, '\t'));
console.log(`rescored ${results.length}; results.json holds ${all.length}`);
