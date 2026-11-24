import { expect, test } from '@playwright/test';
import { FLAT } from '../src/lib/docs/nav.ts';

const ORIGIN = 'https://sveltier.com';

test('the sitemap lists the home page and every page of the navigation', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('xml');
	const locations = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	expect(new Set(locations).size).toBe(locations.length);
	expect(locations).toContain(`${ORIGIN}/`);
	for (const { path } of FLAT) expect(locations).toContain(`${ORIGIN}/${path}`);
	expect(locations.some((location) => location.includes('/examples/'))).toBe(false);
});

test('robots.txt points at the sitemap', async ({ request }) => {
	expect(await (await request.get('/robots.txt')).text()).toContain(
		`Sitemap: ${ORIGIN}/sitemap.xml`
	);
});

test('a page names its own canonical URL in the prerendered HTML', async ({ request }) => {
	const html = await (await request.get('/components/button')).text();
	expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/components/button"`);
});

test('a docs page has a link preview with its own title and description', async ({ request }) => {
	const html = await (await request.get('/components/button')).text();
	expect(html).toContain('property="og:title" content="Button · Sveltier"');
	expect(html).toMatch(/property="og:description" content="[^"]+"/);
	expect(html).toContain(`property="og:image" content="${ORIGIN}/social-card.png"`);
	expect(html).toContain('name="twitter:card" content="summary_large_image"');
});

test('an example app shown in a frame has no canonical URL', async ({ request }) => {
	const html = await (await request.get('/examples/gallery/dark')).text();
	expect(html).not.toContain('rel="canonical"');
});
