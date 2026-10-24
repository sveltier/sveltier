import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

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
