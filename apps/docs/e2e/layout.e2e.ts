import { readFileSync } from 'node:fs';
import { expect, test, type Browser, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

/** The example as the server sends it, before any script runs, on a screen this wide. */
async function withoutScript(browser: Browser, width: number) {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width, height: 800 }
	});
	const page = await context.newPage();
	await page.goto('/examples/app-layout/bar/overview');
	return { page, close: () => context.close() };
}

// The app layout example, prerendered: the layout is right before any script runs, and the
// drawer moves between the grid and a modal drawer with the width of the screen.

test('the server sends the drawer beside the content on a wide screen', async ({ browser }) => {
	const { page, close } = await withoutScript(browser, 1280);
	const drawer = page.getByRole('navigation', { name: 'Main' });
	await expect(drawer).toBeVisible();
	const nav = await drawer.boundingBox();
	const main = await page.getByRole('main').boundingBox();
	expect(main!.x).toBeCloseTo(nav!.x + nav!.width, 0);
	await expect(page.getByRole('button', { name: 'Navigation' })).toBeHidden();
	await close();
});

test('the server sends the content full width with a menu button on a phone', async ({
	browser
}) => {
	const { page, close } = await withoutScript(browser, 390);
	await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
	await expect(page.getByRole('button', { name: 'Navigation' })).toBeVisible();
	expect((await page.getByRole('main').boundingBox())!.x).toBe(0);
	await close();
});

test.describe('on a phone', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('the menu button opens the drawer, and a link in it closes it', async ({ page }) => {
		await open(page, '/examples/app-layout/bar/overview');
		const menu = page.getByRole('button', { name: 'Navigation' });
		await menu.click();
		const drawer = page.getByRole('dialog', { name: 'Navigation' });
		await expect(drawer).toBeVisible();
		await expect(menu).toHaveAttribute('aria-expanded', 'true');
		await drawer.getByRole('link', { name: 'Payments' }).click();
		await expect(drawer).toBeHidden();
		await expect(page).toHaveURL(/\/examples\/app-layout\/bar\/payments$/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Payments');
	});
});

test('the rail narrows the drawer to its icons, and the links keep their names', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await open(page, '/examples/app-layout/bar/overview');
	const drawer = page.getByRole('navigation', { name: 'Main' });
	const wide = (await drawer.boundingBox())!.width;
	await page.getByRole('button', { name: 'Collapse' }).click();
	await expect.poll(async () => (await drawer.boundingBox())!.width).toBeLessThan(wide / 3);
	await expect(drawer.getByRole('link', { name: 'Payments' })).toBeVisible();
});

test('the docs page shows the example on a desktop and on a phone', async ({ page }) => {
	await open(page, '/layout/app-layout');
	const frame = page.frameLocator('iframe[title="App layout example"]');
	await expect(frame.getByRole('navigation', { name: 'Main' })).toBeVisible();
	await page.getByRole('radio', { name: 'Phone' }).click();
	await expect(frame.getByRole('button', { name: 'Navigation' })).toBeVisible();
	await expect(frame.getByRole('navigation', { name: 'Main' })).toBeHidden();
});

// The preview server ignores Cloudflare's _headers, which forbid frames on every other page.
test('the deployed site lets its own pages frame the examples, and no other site', () => {
	const rules = readFileSync(new URL('../static/_headers', import.meta.url), 'utf8');
	const examples = rules.split(/\n\s*\n/).find((rule) => /^\/examples\/\*$/m.test(rule));
	expect(examples).toContain('! X-Frame-Options');
	expect(examples).toContain("Content-Security-Policy: frame-ancestors 'self'");
});

test('the grid lays three accounts a line on a desktop, and one a line on a phone', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await open(page, '/layout/grid');
	const columns = page.locator('.docs-demo .sv-col');
	const lines = async () => {
		const boxes = await Promise.all((await columns.all()).map((column) => column.boundingBox()));
		return new Set(boxes.map((box) => Math.round(box!.y))).size;
	};
	await expect(columns).toHaveCount(3);
	expect(await lines()).toBe(1);
	await page.setViewportSize({ width: 390, height: 844 });
	await expect.poll(lines).toBe(3);
});
