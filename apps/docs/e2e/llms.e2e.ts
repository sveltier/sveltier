import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extractApi, type ApiRow } from '../vite/api.js';

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
	// One name for one thing, so an agent can carry a prop from one component to the next.
	expect(text).toContain('choices are `options`');
	expect(text).toContain('Select and Combobox take `options`');
	expect(text).not.toContain('Select and Combobox take `items`');
	expect(text).toContain('uses `AppLayout fill`');
	expect(text).toContain('calls `onchange` with its new value');
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

test('the prop tables say which props are required', async ({ page, request }) => {
	// PriceInput cannot work without a tick: its type requires one.
	const markdown = await (await request.get('/agents/docs/finance/price-input.md')).text();
	expect(markdown).toMatch(/\| `tick` \(required\) \| `NumberStep` \|/);
	expect(markdown).toMatch(/\| `min` \| /);
	const manifest = (await (await request.get('/agents/components.json')).json()) as {
		entries: { name: string; types: Record<string, { name: string; required?: boolean }[]> }[];
	};
	const rows = manifest.entries.find((entry) => entry.name === 'PriceInput')!.types[
		'PriceInputProps'
	]!;
	expect(rows.find((row) => row.name === 'tick')?.required).toBe(true);
	expect(rows.find((row) => row.name === 'min')?.required).toBeUndefined();
	// Required props come first.
	expect(rows[0]?.name).toBe('tick');
	await page.goto('/finance/price-input');
	const table = page.getByRole('region', { name: 'PriceInput props' });
	await expect(table.getByRole('row', { name: /^tick required/ })).toBeVisible();
	await expect(table.getByRole('row', { name: /^min required/ })).toHaveCount(0);
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

test('a Markdown page has every sample and type table of its page on the site', async ({
	request
}) => {
	// What a component takes in its lists, and how to use it beyond the first sample.
	const tabs = await (await request.get('/agents/docs/components/tabs.md')).text();
	expect(tabs).toContain('`TabsItem`:');
	expect(tabs).toMatch(/\| `href` \| `string` \|/);
	expect(tabs).toContain('### Links between pages');
	expect(tabs).toContain("href: '/learn/lessons'");
	const segmented = await (
		await request.get('/agents/docs/components/segmented-control.md')
	).text();
	expect(segmented).toContain('`SegmentedControlOption`:');
	expect(segmented).toMatch(/\| `attributes` \|/);
	const chip = await (await request.get('/agents/docs/components/chip.md')).text();
	expect(chip).toContain('### A hint on a tag');
	expect(chip).toContain('tabindex={0}');

	const manifest = await (await request.get('/agents/components.json')).json();
	const entry = manifest.entries.find((item: { name: string }) => item.name === 'Tabs');
	expect(Object.keys(entry.types)).toEqual(['TabsProps', 'TabsItem']);
	expect(entry.examples.map((example: { section: string }) => example.section)).toContain(
		'Links between pages'
	);

	// Every page: the type tables and the samples the site shows are in its Markdown too.
	const routes = join(import.meta.dirname, '../src/routes/(docs)');
	const pages = manifest.entries.map((item: { markdown: string }) =>
		item.markdown.replace(/^docs\/|\.md$/g, '')
	);
	for (const path of new Set<string>(pages)) {
		const source = readFileSync(join(routes, path, '+page.svelte'), 'utf8');
		const markdown = await (await request.get(`/agents/docs/${path}.md`)).text();
		for (const [, type] of source.matchAll(/virtual:sveltier-api\/(\w+)/g)) {
			expect(markdown, `${path}.md lacks the ${type} table`).toContain(`\`${type}\`:`);
		}
		const samples = [...source.matchAll(/<Code\b[^>]*\bcode=\{\w+\}/g)].length;
		const blocks = markdown.match(/^```\w+$/gm)?.length ?? 0;
		expect(blocks, `${path}.md has fewer samples than the page`).toBeGreaterThanOrEqual(samples);
	}
});

test('every type a documented prop refers to has a table of its own', async ({ request }) => {
	const manifest: { entries: { types: Record<string, ApiRow[]> }[] } = await (
		await request.get('/agents/components.json')
	).json();
	const tables = extractApi();
	const documented = new Set(manifest.entries.flatMap((entry) => Object.keys(entry.types)));
	// Unions documented through their members.
	const UNIONS: Record<string, string[]> = { TableColumn: ['TableKeyColumn', 'TableValueColumn'] };
	const missing = new Set<string>();
	for (const entry of manifest.entries) {
		for (const [type, rows] of Object.entries(entry.types)) {
			for (const row of rows) {
				for (const [name] of row.type.matchAll(/\b[A-Z]\w*\b/g)) {
					const members = UNIONS[name];
					if (!tables[name] || documented.has(name)) continue;
					if (members?.every((member) => documented.has(member))) continue;
					missing.add(`${name} (${type}.${row.name})`);
				}
			}
		}
	}
	expect([...missing], 'Add these types to their entry in llms.ts and to the page').toEqual([]);
});
