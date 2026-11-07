// `npx sveltier init`: points the coding agents of an app at the docs of the installed
// Sveltier. Run it in the app's folder. It writes a marked block into the app's AGENTS.md
// (replaced in place on later runs), lets a CLAUDE.md import it, and installs the skill where
// a .claude folder is. In a workspace, the app may sit below the repository root, where
// CLAUDE.md and .claude usually live: init finds that root and writes each path from where it
// is read. Plain Node, no dependencies; every file it reads ships in this package.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = join(dirname(fileURLToPath(import.meta.url)), '..');
const INSTALLED = 'node_modules/@sveltier/ui';
export const START = '<!-- sveltier:start -->';
export const END = '<!-- sveltier:end -->';

/** A relative path as Markdown and Claude's imports write it: forward slashes. */
const posix = (path) => path.split(sep).join('/');

/**
 * The nearest folder, from `from` up, where `found` holds. The search stops below the home
 * folder: a home that is itself a repository (dotfiles) is not the app's workspace, and its
 * CLAUDE.md and .claude belong to the user, not to the app.
 * @param {string} from
 * @param {(folder: string) => boolean} found
 * @returns {string | undefined}
 */
function upward(from, found) {
	const home = homedir();
	for (let folder = from; folder !== home; folder = dirname(folder)) {
		if (found(folder)) return folder;
		if (dirname(folder) === folder) return undefined;
	}
	return undefined;
}

/**
 * Where init writes: the app, the repository root above it, and the installed package as seen
 * from the app (its own node_modules, or a workspace's hoisted one).
 * @param {string} app
 */
export function locate(app) {
	const root =
		upward(app, (folder) =>
			['.git', 'pnpm-workspace.yaml'].some((marker) => existsSync(join(folder, marker)))
		) ?? app;
	const holder = upward(app, (folder) => existsSync(join(folder, INSTALLED, 'package.json')));
	const installed = holder ? join(holder, INSTALLED) : join(app, INSTALLED);
	return { app, root, installed };
}

/**
 * A file of this package with its paths to the installed package written from `base`.
 * @param {string} file
 * @param {string} installed
 * @param {string} base
 */
function adapted(file, installed, base) {
	const text = readFileSync(join(PACKAGE, file), 'utf8');
	return text.replaceAll(INSTALLED, posix(relative(base, installed)) || '.');
}

/**
 * The block for the app's AGENTS.md, between its markers.
 * @param {ReturnType<typeof locate>} [where] Defaults to an app with its own node_modules.
 */
export function agentsBlock(where) {
	const app = where?.app ?? PACKAGE;
	const installed = where?.installed ?? join(app, INSTALLED);
	const text = adapted(join('agents', 'sveltier.md'), installed, app).trim();
	const folder = where && where.app !== where.root ? posix(relative(where.root, where.app)) : '';
	const note = folder ? `\n\nPaths here are relative to \`${folder}/\`, the app's folder.` : '';
	const [heading, ...rest] = text.split('\n\n');
	return `${START}\n${[heading + note, ...rest].join('\n\n')}\n${END}`;
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
 * Hooks the app in `app` up to the docs of the installed Sveltier.
 * @param {string} app The app's folder, where its package.json is.
 * @returns {string[]} What was done, one line each.
 */
export function init(app) {
	const where = locate(app);
	const done = [];

	const agents = join(app, 'AGENTS.md');
	const shown = posix(relative(where.root, agents));
	const before = existsSync(agents) ? readFileSync(agents, 'utf8') : '';
	const after = withBlock(before, agentsBlock(where));
	if (after !== before) {
		writeFileSync(agents, after);
		done.push(before ? `Updated the Sveltier section of ${shown}.` : `Created ${shown}.`);
	} else {
		done.push(`${shown} is up to date.`);
	}

	// Claude Code reads CLAUDE.md, the root's first; an @-import makes it read AGENTS.md too.
	for (const folder of new Set([where.root, app])) {
		const claude = join(folder, 'CLAUDE.md');
		if (!existsSync(claude)) continue;
		const target = posix(relative(folder, agents));
		const text = readFileSync(claude, 'utf8');
		const imported = new RegExp(`@${target.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\b`);
		if (!imported.test(text) && !text.includes(START)) {
			writeFileSync(claude, `${text.trimEnd()}\n\n@${target}\n`);
			done.push(`Added @${target} to ${posix(relative(where.root, claude))}.`);
		}
	}

	// A skill's paths are read from the folder that holds its .claude.
	for (const folder of new Set([where.root, app])) {
		if (!existsSync(join(folder, '.claude'))) continue;
		const skill = join(folder, '.claude', 'skills', 'sveltier', 'SKILL.md');
		const shownSkill = posix(relative(where.root, skill));
		const text = adapted(join('skills', 'sveltier', 'SKILL.md'), where.installed, folder);
		if (existsSync(skill) && readFileSync(skill, 'utf8') === text) {
			done.push(`${shownSkill} is up to date.`);
			continue;
		}
		mkdirSync(dirname(skill), { recursive: true });
		writeFileSync(skill, text);
		done.push(`Installed the skill in ${shownSkill}.`);
	}

	return done;
}
