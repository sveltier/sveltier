// Runs coding agents on the UI tasks and scores what they built.
//
//   node run.mjs --base D:/sveltier-eval --conditions plain,init --model sonnet --parallel 3
//
// Each run copies a base app (`<base>/base-<condition>`: a new SvelteKit app with @sveltier/ui
// installed; `init` adds the AGENTS.md that `npx sveltier init` writes), runs Claude Code on the
// task in it, then scores the result: svelte-check, a production build, a scan of the source and
// a Playwright check of the behaviour the task asked for, in the dev server so that development
// warnings show.
import fs from 'node:fs';
import path from 'node:path';
import { behaviour, build, readTranscript, run, scan, typeCheck } from './score.mjs';
import { promptFor, TASKS } from './tasks.mjs';

const args = Object.fromEntries(
	process.argv.slice(2).reduce((pairs, arg, i, all) => {
		if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]]);
		return pairs;
	}, [])
);
const BASE = args.base ?? 'D:/sveltier-eval';
const CONDITIONS = (args.conditions ?? 'plain,init').split(',');
const MODEL = args.model ?? 'sonnet';
const PARALLEL = Number(args.parallel ?? 3);
const REPEAT = Number(args.repeat ?? 1);
const ONLY = args.tasks ? args.tasks.split(',') : null;
const OUT =
	args.out ?? path.join(BASE, 'runs', new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'));
const CLAUDE = args.claude ?? 'claude';
const AGENT_TIMEOUT = 20 * 60_000;
const PORT = Number(args.port ?? 5300);

// What isolates a run from the machine it runs on: no user settings, instruction files, memory,
// MCP servers or skills; no web access, so the agent works from what the app and the package hold.
const SETTINGS = JSON.stringify({
	claudeMdExcludes: [
		path.join(process.env.USERPROFILE ?? '~', '.claude').replaceAll('\\', '/') + '/**'
	],
	autoMemoryEnabled: false
});
const AGENT_ARGS = [
	'--model',
	MODEL,
	'--output-format',
	'stream-json',
	'--verbose',
	'--setting-sources',
	'project,local',
	'--settings',
	SETTINGS,
	'--strict-mcp-config',
	'--disable-slash-commands',
	'--no-chrome',
	'--no-session-persistence',
	'--permission-mode',
	'acceptEdits',
	'--permission-prompts',
	'none',
	'--allowedTools',
	'Bash(npm *)',
	'Bash(npx *)',
	'Bash(node *)',
	'Bash(ls *)',
	'Bash(cat *)',
	'Bash(head *)',
	'Bash(grep *)',
	'Bash(rg *)',
	'Bash(find *)',
	'Bash(cd *)',
	'Bash(pwd)',
	'Bash(echo *)',
	'Bash(wc *)',
	'Bash(tail *)',
	'Bash(sed -n *)',
	// One shell, so the commands above are the ones it runs; and no web.
	'--disallowedTools',
	'PowerShell',
	'WebFetch',
	'WebSearch'
];

async function agent(task, dir) {
	const started = Date.now();
	const { code, out } = await run(CLAUDE, ['-p', ...AGENT_ARGS], {
		cwd: dir,
		input: promptFor(task),
		timeout: AGENT_TIMEOUT
	});
	fs.writeFileSync(path.join(dir, '.eval-transcript.jsonl'), out);
	return { exit: code, seconds: Math.round((Date.now() - started) / 1000), ...readTranscript(out) };
}

/** Counts what the agent did, from its stream-json transcript. */
async function one(job, port) {
	const dir = path.join(OUT, job.task.id, `${job.condition}-${job.rep}`);
	// Run again into the same --out to finish a stopped run: scored runs are kept, the rest redone.
	const done = path.join(dir, '.eval-result.json');
	if (fs.existsSync(done)) return JSON.parse(fs.readFileSync(done, 'utf8'));
	fs.rmSync(dir, { recursive: true, force: true });
	fs.cpSync(path.join(BASE, `base-${job.condition}`), dir, { recursive: true });
	const log = (message) => console.log(`[${job.task.id} ${job.condition}-${job.rep}] ${message}`);
	log('agent…');
	const agentResult = await agent(job.task, dir);
	log(`agent done in ${agentResult.seconds}s, scoring`);
	const result = {
		task: job.task.id,
		condition: job.condition,
		rep: job.rep,
		model: MODEL,
		agent: agentResult,
		typeCheck: await typeCheck(dir),
		build: await build(dir),
		source: await scan(dir),
		behaviour: await behaviour(job.task, dir, port)
	};
	fs.writeFileSync(path.join(dir, '.eval-result.json'), JSON.stringify(result, null, '\t'));
	log(`pass=${result.behaviour.pass} errors=${result.typeCheck.errors} build=${result.build.ok}`);
	return result;
}

const jobs = [];
for (const task of TASKS.filter((t) => !ONLY || ONLY.includes(t.id)))
	for (const condition of CONDITIONS)
		for (let rep = 1; rep <= REPEAT; rep++) jobs.push({ task, condition, rep });

fs.mkdirSync(OUT, { recursive: true });
console.log(`${jobs.length} runs into ${OUT}`);
const results = [];
let next = 0;
await Promise.all(
	Array.from({ length: Math.min(PARALLEL, jobs.length) }, async (_, worker) => {
		while (next < jobs.length) {
			const job = jobs[next++];
			try {
				results.push(await one(job, PORT + worker));
			} catch (error) {
				console.error(`[${job.task.id} ${job.condition}-${job.rep}] failed to run: ${error.stack}`);
			}
		}
	})
);
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, '\t'));
console.log(`done: ${path.join(OUT, 'results.json')}`);
