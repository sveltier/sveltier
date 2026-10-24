import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Alias } from 'vite';
import { sveltierApi } from './vite/api.ts';

const librarySource = fileURLToPath(new URL('../../packages/sveltier/src/lib', import.meta.url));

// The dev server compiles the library from source, so library edits hot-reload like app code.
// Serving the watched dist instead left stale duplicate modules (two context keys) after
// rebuilds. Builds keep resolving the package exports, so they test the published output.
const devAliases: Alias[] = [
	{ find: /^sveltier$/, replacement: `${librarySource}/index.ts` },
	{ find: /^sveltier\/themes\/(.+)$/, replacement: `${librarySource}/themes/$1.ts` },
	{ find: /^sveltier\/styles\/(.+)$/, replacement: `${librarySource}/styles/$1` },
	// The library's development checks; builds take #dev from the package's import map.
	{ find: /^#dev$/, replacement: `${librarySource}/dev/on.ts` }
];

export default defineConfig(({ command }) => ({
	resolve: { alias: command === 'serve' ? devAliases : [] },
	plugins: [
		sveltierApi(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// A real 404 page: without one, Cloudflare treats the site as a single-page app and
			// answers every unknown path with the home page and a 200.
			adapter: adapter({ fallback: '404.html' }),
			// The production origin, so prerendered absolute URLs (link previews) point at it.
			paths: { origin: 'https://sveltier.com' }
		})
	]
}));
