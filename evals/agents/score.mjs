// Scores what an agent built: its transcript, svelte-check, a build, a scan of the source and a
// Playwright check of the task's behaviour in the dev server.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

export function run(command, commandArgs, options = {}) {
	return new Promise((resolve) => {
		const child = spawn(command, commandArgs, { ...options, windowsHide: true });
		let out = '';
		child.stdout?.on('data', (d) => (out += d));
		child.stderr?.on('data', (d) => (out += d));
		const timer = options.timeout ? setTimeout(() => child.kill(), options.timeout) : null;
		child.on('close', (code) => {
			if (timer) clearTimeout(timer);
			resolve({ code, out });
		});
		if (options.input !== undefined) child.stdin.end(options.input);
	});
}

export const bin = (dir, ...parts) => path.join(dir, 'node_modules', ...parts);

export function readTranscript(text) {
	const events = text
		.split('\n')
		.filter((line) => line.startsWith('{'))
		.map((line) => {
			try {
				return JSON.parse(line);
			} catch {
				return null;
			}
		})
		.filter(Boolean);
	const calls = new Map();
	let checks = 0;
	let failedChecks = 0;
	let denied = 0;
	let docsRead = 0;
	let typesRead = 0;
	for (const event of events) {
		for (const part of event.message?.content ?? []) {
			if (part.type === 'tool_use') {
				calls.set(part.id, part);
				const input = JSON.stringify(part.input ?? {});
				if (/@sveltier[\\/]+ui[\\/]+(llms|docs|components\.json|README)/.test(input)) docsRead++;
				if (/@sveltier[\\/]+ui[\\/]+dist/.test(input)) typesRead++;
			}
			if (part.type === 'tool_result') {
				const body = JSON.stringify(part.content ?? '');
				if (/Permission for this tool use was denied/.test(body)) {
					denied++;
					continue;
				}
				const command = calls.get(part.tool_use_id)?.input?.command ?? '';
				if (/svelte-check|npm run check|npm run build|vite build/.test(command)) {
					checks++;
					// svelte-check: "found 2 errors"; a build: "error during build" or a non-zero exit.
					if (
						/found [1-9]\d* errors?|[1-9]\d* ERRORS|error during build/i.test(body) ||
						part.is_error
					)
						failedChecks++;
				}
			}
		}
	}
	const result = events.find((event) => event.type === 'result') ?? {};
	return {
		turns: result.num_turns ?? null,
		costUsd: result.total_cost_usd ?? null,
		toolCalls: calls.size,
		checks,
		failedChecks,
		denied,
		docsRead,
		typesRead,
		finalMessage: typeof result.result === 'string' ? result.result.slice(0, 2000) : null
	};
}

export async function typeCheck(dir) {
	await run(process.execPath, [bin(dir, '@sveltejs', 'kit', 'svelte-kit.js'), 'sync'], {
		cwd: dir
	});
	const { out } = await run(
		process.execPath,
		[
			bin(dir, 'svelte-check', 'bin', 'svelte-check'),
			'--tsconfig',
			'./tsconfig.json',
			'--output',
			'machine'
		],
		{ cwd: dir, timeout: 5 * 60_000 }
	);
	const done = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(out);
	const errors = out
		.split('\n')
		.filter((line) => / ERROR /.test(line))
		.slice(0, 10)
		.map((line) => line.replace(/^\d+ ERROR /, '').slice(0, 300));
	return done
		? { errors: Number(done[1]), warnings: Number(done[2]), first: errors }
		: { errors: null, warnings: null, first: [out.slice(-500)] };
}

export async function build(dir) {
	const { code, out } = await run(process.execPath, [bin(dir, 'vite', 'bin', 'vite.js'), 'build'], {
		cwd: dir,
		timeout: 5 * 60_000
	});
	return { ok: code === 0, tail: code === 0 ? null : out.slice(-800) };
}

/** Every `--sv-*` name the installed library mentions, in its CSS or in the theme code. */
async function libraryVariables(dir) {
	const names = new Set();
	const walk = (folder) => {
		for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
			const full = path.join(folder, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (/\.(css|js|svelte)$/.test(entry.name))
				for (const match of fs.readFileSync(full, 'utf8').matchAll(/--sv-[\w-]+/g))
					names.add(match[0]);
		}
	};
	walk(bin(dir, '@sveltier', 'ui', 'dist'));
	// Theme variables are written from each theme's keys: the stylesheet of every pack names them.
	const dist = (...parts) => pathToFileURL(bin(dir, '@sveltier', 'ui', 'dist', ...parts)).href;
	const { themeCss } = await import(dist('core', 'theme', 'css.js'));
	const themes = {};
	for (const pack of ['monolith', 'heritage', 'aurora', 'maison', 'milano'])
		Object.assign(themes, (await import(dist('themes', `${pack}.js`)))[pack]);
	for (const match of themeCss({
		themes,
		light: 'monolith-light',
		dark: 'monolith-dark',
		fallback: 'system'
	}).matchAll(/--sv-[\w-]+/g))
		names.add(match[0]);
	return names;
}

/** Patterns in the agent's own source that the library's conventions rule out. */
export async function scan(dir) {
	const files = [];
	const walk = (folder) => {
		for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
			const full = path.join(folder, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (/\.(svelte|ts|js)$/.test(entry.name)) files.push(full);
		}
	};
	walk(path.join(dir, 'src'));
	const text = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
	const count = (pattern) => (text.match(pattern) ?? []).length;
	const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
	const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
	const known = await libraryVariables(dir);
	const used = new Set(Array.from(text.matchAll(/var\((--sv-[\w-]+)/g), (match) => match[1]));
	return {
		uiProvider: /<UIProvider\b/.test(text),
		// var(--sv-…) names that the library never defines: they fall back, or resolve to nothing.
		unknownVariables: [...used].filter((name) => !known.has(name)),
		svelte4: count(/export let |\bon:[a-z]+=|<slot\b|createEventDispatcher|^\s*\$:\s/gm),
		// oklch( and its kin too: a DESIGN.md writes the theme's colours that way.
		fixedColours: count(/#[0-9a-fA-F]{3,8}\b(?![\w-])|\brgba?\(|\bhsla?\(|\b(?:ok)?l(?:ab|ch)\(/g),
		nativeControls: count(/<(button|table|dialog|select|input)\b/g),
		addedDependencies: deps.filter(
			(name) =>
				!/^(@sveltier\/ui|@sveltejs\/|svelte|svelte-check|typescript|vite)$/.test(name) &&
				!name.startsWith('@sveltejs/')
		)
	};
}

export async function behaviour(task, dir, port) {
	const server = spawn(
		process.execPath,
		[bin(dir, 'vite', 'bin', 'vite.js'), 'dev', '--port', String(port), '--strictPort'],
		{
			cwd: dir,
			windowsHide: true
		}
	);
	const url = `http://localhost:${port}`;
	try {
		for (let i = 0; i < 60; i++) {
			try {
				await fetch(url);
				break;
			} catch {
				await new Promise((r) => setTimeout(r, 500));
			}
		}
		const browser = await chromium.launch();
		const page = await browser.newPage();
		const warnings = new Set();
		const errors = [];
		page.on('console', (message) => {
			const text = message.text();
			const code = /\[sveltier (SV\d+)\]/.exec(text);
			if (code) warnings.add(code[1]);
			else if (message.type() === 'error') errors.push(text.slice(0, 300));
		});
		page.on('pageerror', (error) => errors.push(error.message.slice(0, 300)));
		let pass = false;
		let failure = null;
		try {
			await page.goto(url + task.route, { waitUntil: 'networkidle', timeout: 60_000 });
			await page.waitForTimeout(500);
			page.setDefaultTimeout(8_000);
			await task.check(page);
			pass = true;
		} catch (error) {
			failure = String(error.message ?? error)
				.split('\n')
				.slice(0, 6)
				.join('\n');
			await page
				.screenshot({ path: path.join(dir, '.eval-failure.png'), fullPage: true })
				.catch(() => {});
		}
		await browser.close();
		return { pass, failure, sveltierWarnings: [...warnings], consoleErrors: errors.slice(0, 5) };
	} finally {
		server.kill();
	}
}
