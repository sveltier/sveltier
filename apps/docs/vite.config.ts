import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Alias } from 'vite';

const librarySource = fileURLToPath(new URL('../../packages/sveltier/src/lib', import.meta.url));

// The dev server compiles the library from source, so library edits hot-reload like app code.
// Serving the watched dist instead left stale duplicate modules (two context keys) after
// rebuilds. Builds keep resolving the package exports, so they test the published output.
const devAliases: Alias[] = [
	{ find: /^sveltier$/, replacement: `${librarySource}/index.ts` },
	{ find: /^sveltier\/themes\/(.+)$/, replacement: `${librarySource}/themes/$1.ts` },
	{ find: /^sveltier\/styles\/(.+)$/, replacement: `${librarySource}/styles/$1` }
];

export default defineConfig(({ command }) => ({
	resolve: { alias: command === 'serve' ? devAliases : [] },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	]
}));
