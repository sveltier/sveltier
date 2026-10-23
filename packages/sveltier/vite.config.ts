import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte({ configFile: false, compilerOptions: { runes: true } })],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'browser',
					include: ['src/**/*.svelte.test.ts'],
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
