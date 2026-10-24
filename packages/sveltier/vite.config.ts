import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte({ configFile: false, compilerOptions: { runes: true } })],
	// Tests run the development checks from source; builds resolve #dev through package.json.
	resolve: {
		alias: { '#dev': fileURLToPath(new URL('./src/lib/dev/on.ts', import.meta.url)) }
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'browser',
					include: ['src/**/*.svelte.test.ts'],
					// Focus is one per page, and every file runs in an iframe of the same page. Files run
					// one at a time so they cannot take focus from each other, and each test first gives
					// its frame focus, which Firefox needs before focus() takes effect in it.
					fileParallelism: false,
					setupFiles: ['src/tests/setup-browser.ts'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						// Focus and keyboard behaviour differ between engines (notably WebKit),
						// so behaviour tests run in all three.
						instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }]
					}
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.test.ts'],
					exclude: ['src/**/*.svelte.test.ts']
				}
			}
		]
	}
});
