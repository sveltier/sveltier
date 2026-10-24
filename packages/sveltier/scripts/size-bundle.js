// Bundles every entry in size.config.js with Vite, as a consumer app would, so that
// size-limit measures the real JS + CSS cost of each public entry point.
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';
import entries from '../size.config.js';
import { SIZE_DIR, slug } from './size-shared.js';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(path.join(dist, 'index.js'))) {
	throw new Error('dist/ is missing. Run `pnpm build` before `pnpm size`.');
}

fs.rmSync(path.join(root, SIZE_DIR), { recursive: true, force: true });

for (const entry of entries) {
	const id = slug(entry.name);
	const entryFile = path.join(root, SIZE_DIR, 'entries', `${id}.js`);
	fs.mkdirSync(path.dirname(entryFile), { recursive: true });
	fs.writeFileSync(entryFile, entry.code + '\n');

	await build({
		configFile: false,
		logLevel: 'warn',
		root,
		plugins: [svelte({ configFile: false, compilerOptions: { runes: true } })],
		resolve: {
			alias: [
				{ find: /^@sveltier\/ui$/, replacement: path.join(dist, 'index.js') },
				{ find: /^@sveltier\/ui\/(.*)$/, replacement: path.join(dist, '$1') }
			]
		},
		// An app build (not library mode): library mode keeps whitespace in ES output, which a
		// consumer's own production build would remove.
		build: {
			outDir: path.join(root, SIZE_DIR, 'out', id),
			emptyOutDir: true,
			minify: true,
			cssMinify: true,
			cssCodeSplit: false,
			modulePreload: false,
			rolldownOptions: {
				input: entryFile,
				preserveEntrySignatures: 'strict',
				// Lazily loaded modules can be left out and measured as entries of their own, so the
				// bundler's preload helper (shared by every dynamic import of an app) is not counted.
				external: [/^svelte($|\/)/, ...(entry.external ?? [])],
				output: {
					entryFileNames: 'index.js',
					chunkFileNames: 'chunk-[name].js',
					assetFileNames: 'index[extname]'
				}
			}
		}
	});
}
