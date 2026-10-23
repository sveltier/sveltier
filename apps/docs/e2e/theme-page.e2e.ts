import { expect, test, type Page } from '@playwright/test';

const htmlVar = (page: Page, name: string) =>
	page.evaluate(
		(variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
		name
	);

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/theme');
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
});

test('each pack tile paints its own nested theme, type included', async ({ page }) => {
	const tiles = page.locator('.docs-pack');
	await expect(tiles).toHaveCount(5);
	const looks = await tiles.evaluateAll((elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return `${style.getPropertyValue('--sv-color-background')}|${style.fontFamily}`;
		})
	);
	expect(new Set(looks).size).toBe(5);
	await expect(tiles.nth(0)).toHaveAttribute('data-sv-theme', 'monolith-light');
});

test('applying a pack themes the whole site and is remembered', async ({ page }) => {
	const tile = page.locator('.docs-pack[data-sv-theme="maison-light"]');
	await tile.getByRole('button', { name: 'Dark' }).click();

	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'maison-dark');
	await expect(tile.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
	await expect(page.getByRole('radio', { name: 'Maison' })).toBeChecked();
	await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
	expect(await page.evaluate(() => localStorage.getItem('sv-theme'))).toBe('maison-dark');
	expect(await htmlVar(page, '--sv-radius-md')).toBe('0px');
	await expect(page.getByRole('heading', { name: 'Maison in use' })).toBeVisible();
});

test('the pack switch restyles the system theme', async ({ page }) => {
	expect(await htmlVar(page, '--sv-color-background')).toBe('oklch(0.985 0.002 260)');

	await page.getByRole('radio', { name: 'Milano' }).check();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
	await expect.poll(() => htmlVar(page, '--sv-color-background')).toBe('oklch(0.955 0.013 75)');
	expect(await htmlVar(page, '--sv-radius-md')).toBe('999px');
});

test('the token tables report live values', async ({ page }) => {
	const colour = page.getByRole('row').filter({ hasText: '--sv-color-text-subtle' });
	await expect(colour).toContainText('oklch(0.52 0.006 260)');
	await expect(colour.getByRole('cell').last()).toHaveText(/^\d+\.\d\d:1$/);
	const contract = page.getByRole('row').filter({ hasText: '--sv-radius-md' });
	await expect(contract).toContainText('8px');
});

test('reduced motion wins over theme durations', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
	await page
		.locator('.docs-pack[data-sv-theme="maison-light"]')
		.getByRole('button', { name: 'Light' })
		.click();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'maison-light');
	expect(parseFloat(await htmlVar(page, '--sv-duration-slow'))).toBeLessThan(1);

	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
	expect(await htmlVar(page, '--sv-duration-slow')).toBe('450ms');
});
