import { expect, test } from '@playwright/test';

// The DESIGN.md of each theme pack: what an agent reads for how an app looks. Its values must be
// the theme's own, and every variable it names must exist, or it teaches agents to invent them.

const PACKS = ['monolith', 'heritage', 'aurora', 'maison', 'milano'];
/** Names the files mention to say they do not exist. Placeholders (`--sv-on-<name>`) never match. */
const ABSENT = new Set(['--sv-space-4', '--sv-space-16']);

for (const pack of PACKS) {
	test(`the DESIGN.md of ${pack} names only variables the theme sets, at its values`, async ({
		page,
		request
	}) => {
		const response = await request.get(`/design/${pack}.md`);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('text/markdown');
		const text = await response.text();
		expect(text).toMatch(/^---\nversion: alpha\nname: "Sveltier [A-Z][a-z]+"\n/);
		expect(text).toContain(`import { ${pack} } from '@sveltier/ui/themes/${pack}';`);

		await page.goto('/');
		await page.evaluate((name) => localStorage.setItem('sv-theme', name), `${pack}-light`);
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-sv-theme', `${pack}-light`);

		const names = [...new Set(text.match(/--sv-[a-z0-9-]+(?![\w<-])/g))].filter(
			(name) => !ABSENT.has(name)
		);
		expect(names.length).toBeGreaterThan(40);
		const values = await page.evaluate((list) => {
			const style = getComputedStyle(document.documentElement);
			return Object.fromEntries(list.map((name) => [name, style.getPropertyValue(name).trim()]));
		}, names);
		const missing = names.filter((name) => values[name] === '');
		expect(missing, 'variables a DESIGN.md names but the theme does not set').toEqual([]);

		// The front matter's values are the ones the page computes.
		const yaml = (key: string) =>
			text.match(new RegExp(`^ {2}"?${key}"?: "?([^"\\n]+)"?$`, 'm'))?.[1];
		const live = (name: string) =>
			page.evaluate(
				(variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
				name
			);
		expect(yaml('primary')).toBe(await live('--sv-color-primary'));
		expect(yaml('background')).toBe(await live('--sv-color-background'));
		expect(yaml('md')).toBe(await live('--sv-radius-md'));
		// The build writes 0.8125rem as .8125rem.
		expect(parseFloat(yaml('13') ?? '')).toBe(parseFloat(await live('--sv-space-13')));
	});
}
