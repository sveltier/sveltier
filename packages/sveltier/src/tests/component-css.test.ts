import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { themeCss } from '../lib/core/theme/css.js';
import { aurora } from '../lib/themes/aurora.js';
import { heritage } from '../lib/themes/heritage.js';
import { maison } from '../lib/themes/maison.js';
import { milano } from '../lib/themes/milano.js';
import { monolith } from '../lib/themes/monolith.js';

// Consumers' bundlers keep a component's CSS only when the component module imports it:
// a stylesheet imported from index.ts is dropped, because index.ts is side-effect free.
const root = join(import.meta.dirname, '../lib/components');
const folders = readdirSync(root, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);
const files = (folder: string) => readdirSync(join(root, folder));
const read = (folder: string, file: string) => readFileSync(join(root, folder, file), 'utf8');
const LAYERS = '@layer sv.tokens, sv.base, sv.components, sv.utilities;';

describe('component stylesheets', () => {
	it('exist for at least one component', () => {
		expect(folders.length).toBeGreaterThan(0);
	});

	it('are imported by a component in their folder', () => {
		const orphans = folders.flatMap((folder) => {
			const components = files(folder)
				.filter((file) => file.endsWith('.svelte'))
				.map((file) => read(folder, file))
				.join('\n');
			return files(folder)
				.filter((file) => file.endsWith('.css') && !components.includes(`import './${file}';`))
				.map((file) => `${folder}/${file}`);
		});
		expect(orphans).toEqual([]);
	});

	it('are never imported from index.ts', () => {
		const offenders = folders.filter(
			(folder) => files(folder).includes('index.ts') && read(folder, 'index.ts').includes('.css')
		);
		expect(offenders).toEqual([]);
	});

	it('start with the layer order, so any of them can load first', () => {
		const unordered = folders.flatMap((folder) =>
			files(folder)
				.filter((file) => file.endsWith('.css') && !read(folder, file).startsWith(LAYERS))
				.map((file) => `${folder}/${file}`)
		);
		expect(unordered).toEqual([]);
	});
});

// A variable read with no fallback resolves to nothing when no one sets it: a misspelt colour
// token falls back to the inherited colour, and text the colour of its fill vanishes with no
// error. Every such read must be set by a stylesheet, a theme or a component's inline style.
const lib = join(import.meta.dirname, '../lib');
const SET = /(--sv-[\w-]+)\s*:/g;
const SET_INLINE = /(?:style:|['"`])(--sv-[\w-]+)/g;
const READ = /var\(\s*(--sv-[\w-]+)\s*\)/g;

function sources(dir: string, pattern: RegExp): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return sources(path, pattern);
		return pattern.test(entry.name) && !entry.name.includes('.test.') ? [path] : [];
	});
}

describe('variables in stylesheets', () => {
	it('are read only when a stylesheet, a theme or an inline style sets them', () => {
		const set = new Set<string>();
		const collect = (text: string, pattern: RegExp) => {
			for (const match of text.matchAll(pattern)) set.add(match[1]!);
		};
		for (const pack of [aurora, heritage, maison, milano, monolith]) {
			const [light, dark] = Object.keys(pack) as [string, string];
			collect(themeCss({ themes: pack, light, dark, fallback: light }), SET);
		}
		const sheets = sources(lib, /\.css$/);
		for (const file of sheets) collect(readFileSync(file, 'utf8'), SET);
		for (const file of sources(lib, /\.(svelte|ts)$/))
			collect(readFileSync(file, 'utf8'), SET_INLINE);
		expect(set.has('--sv-color-primary') && set.has('--sv-on-primary')).toBe(true);

		const unset = sheets.flatMap((file) =>
			[...readFileSync(file, 'utf8').matchAll(READ)]
				.filter((match) => !set.has(match[1]!))
				.map((match) => `${relative(lib, file)}: ${match[1]}`)
		);
		expect(unset).toEqual([]);
	});
});
