import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { agentsBlock, END, init, START, withBlock } from '../../bin/init.js';

// `npx sveltier init` in a fresh app folder: what it writes, and that a second run changes
// nothing but its own block.
const BIN = join(import.meta.dirname, '..', '..', 'bin', 'sveltier.js');
let app: string;
const read = (name: string) => readFileSync(join(app, name), 'utf8');

beforeEach(() => {
	app = mkdtempSync(join(tmpdir(), 'sveltier-init-'));
});

afterEach(() => {
	rmSync(app, { recursive: true, force: true });
});

describe('sveltier init', () => {
	it('creates AGENTS.md pointing at the docs in the package', () => {
		expect(init(app)).toEqual(['Created AGENTS.md.']);
		const text = read('AGENTS.md');
		expect(text.startsWith(START)).toBe(true);
		expect(text.trimEnd().endsWith(END)).toBe(true);
		expect(text).toContain('node_modules/@sveltier/ui/llms.txt');
		expect(text).toContain('Never write `export let`');
	});

	it('keeps what an AGENTS.md already says and replaces only its own block', () => {
		writeFileSync(join(app, 'AGENTS.md'), '# Project\n\nUse pnpm.\n');
		init(app);
		expect(read('AGENTS.md')).toBe(`# Project\n\nUse pnpm.\n\n${agentsBlock()}\n`);

		const stale = read('AGENTS.md').replace('Svelte 5 only', 'Svelte 4 too') + '\n## Later\n';
		writeFileSync(join(app, 'AGENTS.md'), stale);
		expect(init(app)).toEqual(['Updated the Sveltier section of AGENTS.md.']);
		expect(read('AGENTS.md')).toBe(`# Project\n\nUse pnpm.\n\n${agentsBlock()}\n\n## Later\n`);
		expect(init(app)).toEqual(['AGENTS.md is up to date.']);
	});

	it('lets CLAUDE.md import AGENTS.md, once', () => {
		writeFileSync(join(app, 'CLAUDE.md'), '# Notes\n');
		expect(init(app)).toContain('Added @AGENTS.md to CLAUDE.md.');
		expect(read('CLAUDE.md')).toBe('# Notes\n\n@AGENTS.md\n');
		expect(init(app)).not.toContain('Added @AGENTS.md to CLAUDE.md.');
	});

	it('installs the skill only where the app has a .claude folder', () => {
		init(app);
		expect(existsSync(join(app, '.claude'))).toBe(false);
		mkdirSync(join(app, '.claude'));
		expect(init(app)).toContain('Installed the skill in .claude/skills/sveltier/SKILL.md.');
		expect(read('.claude/skills/sveltier/SKILL.md')).toMatch(/^---\nname: sveltier\n/);
	});

	it('reaches the root of a workspace when the app sits in a folder of it', () => {
		// A pnpm workspace: CLAUDE.md and .claude at the root, the app in web/ with its own
		// node_modules, as pnpm installs it.
		mkdirSync(join(app, '.git'));
		writeFileSync(join(app, 'pnpm-workspace.yaml'), "packages:\n  - 'web'\n");
		writeFileSync(join(app, 'CLAUDE.md'), '# Workspace\n');
		mkdirSync(join(app, '.claude'));
		const web = join(app, 'web');
		mkdirSync(join(web, 'node_modules', '@sveltier', 'ui'), { recursive: true });
		writeFileSync(join(web, 'node_modules', '@sveltier', 'ui', 'package.json'), '{}');

		expect(init(web)).toEqual([
			'Created web/AGENTS.md.',
			'Added @web/AGENTS.md to CLAUDE.md.',
			'Installed the skill in .claude/skills/sveltier/SKILL.md.'
		]);
		const agents = read('web/AGENTS.md');
		expect(agents).toContain("Paths here are relative to `web/`, the app's folder.");
		expect(agents).toContain('`node_modules/@sveltier/ui/llms.txt`');
		expect(read('CLAUDE.md')).toBe('# Workspace\n\n@web/AGENTS.md\n');
		// Read from the root, the skill's paths start with the app's folder.
		const skill = read('.claude/skills/sveltier/SKILL.md');
		expect(skill).toContain('`web/node_modules/@sveltier/ui/llms.txt`');
		expect(skill).not.toMatch(/[^/]node_modules\/@sveltier\/ui\/llms/);

		expect(init(web)).toEqual([
			'web/AGENTS.md is up to date.',
			'.claude/skills/sveltier/SKILL.md is up to date.'
		]);
	});

	it('installs one copy of the skill, at the root, when the app has a .claude of its own', () => {
		// Another tool made web/.claude for its own skill.
		mkdirSync(join(app, '.git'));
		mkdirSync(join(app, '.claude'));
		const web = join(app, 'web');
		mkdirSync(join(web, '.claude'), { recursive: true });

		expect(init(web)).toEqual([
			'Created web/AGENTS.md.',
			'Installed the skill in .claude/skills/sveltier/SKILL.md.'
		]);
		expect(existsSync(join(web, '.claude', 'skills', 'sveltier'))).toBe(false);

		// A copy an earlier init left in the app's folder is named, not deleted.
		mkdirSync(join(web, '.claude', 'skills', 'sveltier'), { recursive: true });
		writeFileSync(join(web, '.claude', 'skills', 'sveltier', 'SKILL.md'), '---\nname: sveltier\n');
		expect(init(web)).toEqual([
			'web/AGENTS.md is up to date.',
			'.claude/skills/sveltier/SKILL.md is up to date.',
			'web/.claude/skills/sveltier is a second copy of the skill: delete it, so agents find one.'
		]);
		expect(existsSync(join(web, '.claude', 'skills', 'sveltier', 'SKILL.md'))).toBe(true);
	});

	it('installs the skill in the app when only the app has a .claude', () => {
		mkdirSync(join(app, '.git'));
		const web = join(app, 'web');
		mkdirSync(join(web, '.claude'), { recursive: true });
		expect(init(web)).toContain('Installed the skill in web/.claude/skills/sveltier/SKILL.md.');
		expect(read('web/.claude/skills/sveltier/SKILL.md')).toContain(
			'`node_modules/@sveltier/ui/llms.txt`'
		);
	});

	it('finds a package hoisted to the workspace root', () => {
		mkdirSync(join(app, '.git'));
		mkdirSync(join(app, 'node_modules', '@sveltier', 'ui'), { recursive: true });
		writeFileSync(join(app, 'node_modules', '@sveltier', 'ui', 'package.json'), '{}');
		const site = join(app, 'apps', 'site');
		mkdirSync(site, { recursive: true });
		init(site);
		expect(read('apps/site/AGENTS.md')).toContain('`../../node_modules/@sveltier/ui/llms.txt`');
	});

	it('says when the root layout has no UIProvider yet', () => {
		mkdirSync(join(app, 'src', 'routes'), { recursive: true });
		const layout = join(app, 'src', 'routes', '+layout.svelte');
		writeFileSync(layout, '<script>let { children } = $props();</script>{@render children()}');
		expect(init(app)).toContain(
			'src/routes/+layout.svelte has no UIProvider yet: wrap the app in <UIProvider themes={monolith}> there, once (llms.txt, Setup).'
		);
		writeFileSync(layout, '<UIProvider themes={monolith}>{@render children()}</UIProvider>');
		expect(init(app).join(' ')).not.toContain('no UIProvider');
	});

	it('appends to an empty file without leading blank lines', () => {
		expect(withBlock('', 'B')).toBe('B\n');
		expect(withBlock('\n\n', 'B')).toBe('B\n');
	});

	it('runs as a command', () => {
		const output = execFileSync(process.execPath, [BIN, 'init'], { cwd: app, encoding: 'utf8' });
		expect(output).toContain('Created AGENTS.md.');
		expect(execFileSync(process.execPath, [BIN, '--help'], { encoding: 'utf8' })).toContain(
			'Usage: npx sveltier init'
		);
	});
});
