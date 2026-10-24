import { expect, test } from '@playwright/test';

// The docs for AI agents: plain text, built from the navigation and the package's types.

test('llms.txt indexes every docs page', async ({ request }) => {
	const response = await request.get('/llms.txt');
	expect(response.headers()['content-type']).toContain('text/plain');
	const text = await response.text();
	expect(text).toMatch(/^# Sveltier\n\n> /);
	expect(text).toContain('## Components');
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
