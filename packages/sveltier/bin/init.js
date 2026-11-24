// `npx sveltier init`: points the coding agents of an app at the docs of the installed
// Sveltier. Run it in the app's folder. It writes a marked block into the app's AGENTS.md
// (replaced in place on later runs), lets a CLAUDE.md import it, and installs the skill in a
// .claude folder. In a workspace, the app may sit below the repository root, where CLAUDE.md
// and .claude usually live: init finds that root, puts the skill in its .claude (the app's only
// when the root has none), and writes each path from where it is read. It also says when the
// root layout has no UIProvider, which nothing else reports, and gives the app the DESIGN.md of
// its theme pack. Plain Node, no dependencies; every file it reads ships in this package.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = join(dirname(fileURLToPath(import.meta.url)), '..');
const INSTALLED = 'node_modules/@sveltier/ui';
export const START = '<!-- sveltier:start -->';
export const END = '<!-- sveltier:end -->';
/** The root layout of an app, where it sets up the provider and picks its theme pack. */
const LAYOUTS = ['src/routes/+layout.svelte', 'src/App.svelte'];
/** The line of a DESIGN.md that names a Sveltier pack, and so marks the file as one init wrote. */
const OURS = /^name: "Sveltier ([^"]+)"$/m;

/** A relative path as Markdown and Claude's imports write it: forward slashes. */
const posix = (path) => path.split(sep).join('/');

/**
 * Where the skill goes in a folder that has a .claude.
 * @param {string} folder
 */
const skillIn = (folder) => join(folder, '.claude', 'skills', 'sveltier', 'SKILL.md');

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

	// One copy of the skill, so an agent finds one: in the root's .claude, or the app's when the
	// root has none. Its paths are read from the folder that holds that .claude.
	const holder = [where.root, app].find((folder) => existsSync(join(folder, '.claude')));
	if (holder) {
		const skill = skillIn(holder);
		const shownSkill = posix(relative(where.root, skill));
		const text = adapted(join('skills', 'sveltier', 'SKILL.md'), where.installed, holder);
		if (existsSync(skill) && readFileSync(skill, 'utf8') === text) {
			done.push(`${shownSkill} is up to date.`);
		} else {
			mkdirSync(dirname(skill), { recursive: true });
			writeFileSync(skill, text);
			done.push(`Installed the skill in ${shownSkill}.`);
		}
		// An earlier init may have put a second copy in the app's folder.
		const other = skillIn(app);
		if (holder !== app && existsSync(other)) {
			const shownOther = posix(relative(where.root, dirname(other)));
			done.push(`${shownOther} is a second copy of the skill: delete it, so agents find one.`);
		}
	}

	// A page without the provider renders with no theme and raises no error, so say it here.
	const layout = LAYOUTS.map((file) => join(app, file)).find((file) => existsSync(file));
	if (layout && !/\b(UIProvider|ThemeProvider)\b/.test(readFileSync(layout, 'utf8'))) {
		const shownLayout = posix(relative(where.root, layout));
		done.push(
			`${shownLayout} has no UIProvider yet: wrap the app in <UIProvider themes={monolith}> there, once (llms.txt, Setup).`
		);
	}

	return done;
}

/**
 * The pack whose DESIGN.md describes the app: the one its root layout hands the provider as it
 * ships (`themes={heritage}`, imported from the package), or Monolith in an app with no provider
 * yet, which the setup tells agents to add. A theme of the app's own, such as one made with
 * defineTheme over a pack, looks different from any pack: `null`.
 * @param {string} code The root layout.
 * @param {string[]} packs The packs with a DESIGN.md.
 * @returns {string | null}
 */
function shippedPack(code, packs) {
	if (!/\b(UIProvider|ThemeProvider)\b/.test(code)) return 'monolith';
	const passed = /\bthemes=\{\s*([A-Za-z_$][\w$]*)\s*\}/.exec(code)?.[1];
	if (!passed || !packs.includes(passed)) return null;
	const from = new RegExp(
		`import\\s*\\{[^}]*\\b${passed}\\b[^}]*\\}\\s*from\\s*['"]@sveltier/ui(?:/themes/${passed})?['"]`
	);
	return from.test(code) ? passed : null;
}

/**
 * Gives the app the DESIGN.md of its theme pack when it uses one as it ships (see shippedPack).
 * An app with a theme of its own gets none, since a pack's would describe another look; a
 * DESIGN.md that init did not write is the app's own and stays as it is.
 * @param {string} app The app's folder.
 * @param {string} [source] The installed package; this one by default.
 * @returns {string[]} What was done, one line each; nothing when the package has no DESIGN.md.
 */
export function design(app, source = PACKAGE) {
	const folder = join(source, 'design');
	if (!existsSync(folder)) return [];
	const packs = readdirSync(folder)
		.filter((file) => file.endsWith('.md'))
		.map((file) => file.slice(0, -3));
	const layout = LAYOUTS.map((file) => join(app, file)).find((file) => existsSync(file));
	const pack = shippedPack(layout ? readFileSync(layout, 'utf8') : '', packs);
	const target = join(app, 'DESIGN.md');
	const before = existsSync(target) ? readFileSync(target, 'utf8') : undefined;
	const packsShown = posix(relative(app, join(locate(app).installed, 'design')));

	if (pack === null) {
		if (before !== undefined && OURS.test(before)) {
			return [
				`DESIGN.md describes the ${OURS.exec(before)?.[1]} pack as it ships, but the app's themes are its own: edit it to match them, or delete it.`
			];
		}
		if (before !== undefined) return [];
		return [
			`No DESIGN.md: the app's themes are its own, and a pack's would describe another look. To give agents one, start from its pack's in ${packsShown}/ and write in what the app changes.`
		];
	}

	const file = join(folder, `${pack}.md`);
	if (!existsSync(file)) return [];
	const text = readFileSync(file, 'utf8');
	const name = OURS.exec(text)?.[1] ?? pack;
	if (before === text) return ['DESIGN.md is up to date.'];
	if (before !== undefined && !OURS.test(before)) {
		return [
			`DESIGN.md is the app's own, so it stays as it is. The ${name} pack's is in ${packsShown}/${pack}.md.`
		];
	}
	writeFileSync(target, text);
	return [`${before === undefined ? 'Created' : 'Updated'} DESIGN.md from the ${name} theme pack.`];
}
