import { expect, test } from '@playwright/test';

// The docs for AI agents: plain text, built from the navigation and the package's types.

test('llms.txt indexes every docs page', async ({ request }) => {
	const response = await request.get('/llms.txt');
	expect(response.headers()['content-type']).toContain('text/plain');
	const text = await response.text();
	expect(text).toMatch(/^# Sveltier\n\n> /);
	expect(text).toContain('## Components');
	// The package is scoped: npm refuses the bare name, so an agent must never be told to use it.
	expect(text).toContain('Install `@sveltier/ui`');
	expect(text).not.toContain('`sveltier`');
	// Models drift to Svelte 4 syntax, so the index says what not to write.
	expect(text).toContain('Never write Svelte 4 syntax: no `export let`');
	// Hand-written CSS keeps to the theme, pill-shaped controls included.
	expect(text).toContain('`min(var(--sv-radius-md), var(--sv-radius-lg))`');
	expect(text).toContain(
		'- [Button](./components/button): A button, or a link that looks like one'
	);
	expect(text).toContain('(./llms-full.txt)');
});

test('llms-full.txt has every component with its props, from the types', async ({ request }) => {
	const text = await (await request.get('/llms-full.txt')).text();
	for (const name of ['Alert', 'Button', 'Card', 'Tabs', 'virtualList']) {
		expect(text).toContain(`### ${name}`);
	}
	// Pipes inside a table cell are escaped.
	expect(text).toContain(
		String.raw`| ${'`'}variant${'`'} | ${'`'}'elevated' \| 'flat' \| 'tonal' \| 'outlined' \| 'text' \| 'plain'${'`'} | ${'`'}'flat'${'`'} |`
	);
	expect(text).toContain('```svelte');
});

test('the agent docs for the package link its own Markdown pages', async ({ request }) => {
	const index = await (await request.get('/agents/llms.txt')).text();
	expect(index).toContain(
		'- [Button](docs/components/button.md): A button, or a link that looks like one'
	);
	expect(index).toContain('[Installation](https://sveltier.com/getting-started/installation)');
	expect(index).toContain('[Full reference](llms-full.txt)');

	const page = await request.get('/agents/docs/components/button.md');
	expect(page.headers()['content-type']).toContain('text/markdown');
	const markdown = await page.text();
	expect(markdown).toMatch(/^# Button\n/);
	expect(markdown).toContain('[llms.txt](../../llms.txt)');
	expect(markdown).toContain('| `variant` |');

	const manifest = await (await request.get('/agents/components.json')).json();
	expect(manifest.package).toBe('@sveltier/ui');
	const button = manifest.entries.find((entry: { name: string }) => entry.name === 'Button');
	expect(button.markdown).toBe('docs/components/button.md');
	expect(button.types.ButtonProps.map((row: { name: string }) => row.name)).toContain('variant');
});
