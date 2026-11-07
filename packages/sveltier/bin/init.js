// `npx sveltier init`: points the coding agents of an app at the docs of the installed
// Sveltier. It writes a marked block into AGENTS.md (replaced in place on later runs), lets an
// existing CLAUDE.md import AGENTS.md, and installs the skill when the app has a .claude folder.
// Plain Node, no dependencies; every file it reads ships in this package.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = join(dirname(fileURLToPath(import.meta.url)), '..');
export const START = '<!-- sveltier:start -->';
export const END = '<!-- sveltier:end -->';

/** The block for AGENTS.md, between its markers. */
export function agentsBlock() {
	const text = readFileSync(join(PACKAGE, 'agents', 'sveltier.md'), 'utf8').trim();
	return `${START}\n${text}\n${END}`;
}

/**
 * The text of an AGENTS.md with the block in it: replaced where the markers are, appended
 * otherwise.
 * @param {string} text
 * @param {string} block
 * @returns {string}
 */
export function withBlock(text, block) {
	const start = text.indexOf(START);
	const end = text.indexOf(END, start);
	if (start !== -1 && end !== -1) {
		return text.slice(0, start) + block + text.slice(end + END.length);
	}
	const trimmed = text.trimEnd();
	return trimmed ? `${trimmed}\n\n${block}\n` : `${block}\n`;
}

/**
 * Hooks the app in `root` up to the docs of the installed Sveltier.
 * @param {string} root The app's folder, where AGENTS.md lives.
 * @returns {string[]} What was done, one line each.
 */
export function init(root) {
	const done = [];

	const agents = join(root, 'AGENTS.md');
	const before = existsSync(agents) ? readFileSync(agents, 'utf8') : '';
	const after = withBlock(before, agentsBlock());
	if (after !== before) {
		writeFileSync(agents, after);
		done.push(before ? 'Updated the Sveltier section of AGENTS.md.' : 'Created AGENTS.md.');
	} else {
		done.push('AGENTS.md is up to date.');
	}

	// Claude Code reads CLAUDE.md; an @-import makes it read AGENTS.md too.
	const claude = join(root, 'CLAUDE.md');
	if (existsSync(claude)) {
		const text = readFileSync(claude, 'utf8');
		if (!/@AGENTS\.md\b/.test(text) && !text.includes(START)) {
			writeFileSync(claude, `${text.trimEnd()}\n\n@AGENTS.md\n`);
			done.push('Added @AGENTS.md to CLAUDE.md.');
		}
	}

	if (existsSync(join(root, '.claude'))) {
		const folder = join(root, '.claude', 'skills', 'sveltier');
		mkdirSync(folder, { recursive: true });
		writeFileSync(
			join(folder, 'SKILL.md'),
			readFileSync(join(PACKAGE, 'skills', 'sveltier', 'SKILL.md'), 'utf8')
		);
		done.push('Installed the skill in .claude/skills/sveltier/SKILL.md.');
	}

	return done;
}
