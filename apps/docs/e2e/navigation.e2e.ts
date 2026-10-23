import { expect, test } from '@playwright/test';
import { FLAT } from '../src/lib/docs/nav.ts';

test('the sidebar lists every page and marks the current one', async ({ page }) => {
	await page.goto('/getting-started/quick-start');
	const sidebar = page.getByRole('navigation', { name: 'Documentation' });
	await expect(sidebar.getByRole('link')).toHaveCount(FLAT.length);
	await expect(sidebar.getByRole('link', { name: 'Quick start' })).toHaveAttribute(
		'aria-current',
		'page'
	);

	await sidebar.getByRole('link', { name: 'Theme contract' }).click();
	await expect(page).toHaveURL(/\/theming\/contract$/);
	await expect(page.getByRole('heading', { level: 1, name: 'Theme contract' })).toBeVisible();
	await expect(sidebar.getByRole('link', { name: 'Theme contract' })).toHaveAttribute(
		'aria-current',
		'page'
	);
});

test('previous and next links follow the navigation order', async ({ page }) => {
	await page.goto('/getting-started/installation');
	const pager = page.getByRole('navigation', { name: 'Previous and next page' });
	await expect(pager.getByRole('link', { name: /Previous/ })).toHaveCount(0);
	await pager.getByRole('link', { name: /Next.*Quick start/ }).click();
	await expect(page).toHaveURL(/\/getting-started\/quick-start$/);
	await expect(pager.getByRole('link', { name: /Previous.*Installation/ })).toBeVisible();
});

test('every page has one h1 and a table of contents on wide screens', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/getting-started/server-rendering');
	await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
	const toc = page.getByRole('navigation', { name: 'On this page' });
	await expect(toc.getByRole('link').first()).toBeVisible();
	await toc.getByRole('link', { name: 'Content Security Policy' }).click();
	await expect(page).toHaveURL(/#csp$/);
});

test('every theme pack has its own page', async ({ page }) => {
	for (const pack of ['monolith', 'heritage', 'aurora', 'maison', 'milano']) {
		await page.goto(`/theme-packs/${pack}`);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			pack[0]!.toUpperCase() + pack.slice(1)
		);
		await expect(page.locator(`.docs-frame[data-sv-theme="${pack}-dark"]`)).toBeVisible();
	}
});

test.describe('on a phone', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('the menu button opens and closes the navigation', async ({ page }) => {
		await page.goto('/theming');
		const menu = page.getByRole('button', { name: 'Open navigation' });
		const sidebar = page.getByRole('navigation', { name: 'Documentation' });
		await expect(sidebar).toBeHidden();

		await menu.click();
		await expect(sidebar).toBeVisible();
		// The drawer sits below the app bar and fills the rest of the screen.
		const bar = await page.locator('.docs-bar').boundingBox();
		const drawer = await sidebar.boundingBox();
		expect(drawer!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height - 1);
		expect(drawer!.y + drawer!.height).toBeCloseTo(844, 0);
		await expect(page.getByRole('button', { name: 'Close navigation' }).first()).toHaveAttribute(
			'aria-expanded',
			'true'
		);

		await page.keyboard.press('Escape');
		await expect(sidebar).toBeHidden();

		await menu.click();
		await sidebar.getByRole('link', { name: 'Colours' }).click();
		await expect(page).toHaveURL(/\/theming\/colors$/);
		await expect(sidebar).toBeHidden();
	});
});
