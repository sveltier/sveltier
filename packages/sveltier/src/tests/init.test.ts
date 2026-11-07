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

		const stale = read('AGENTS.md').replace('Rules:', 'Old rules:') + '\n## Later\n';
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
