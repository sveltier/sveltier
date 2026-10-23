import { expect, test, type Page } from '@playwright/test';

const htmlVar = (page: Page, name: string) =>
	page.evaluate(
		(variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
		name
	);

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
});

test('each pack tile paints its own nested theme, type included', async ({ page }) => {
	await page.goto('/theme-packs');
	const tiles = page.locator('.docs-pack');
	await expect(tiles).toHaveCount(5);
	const looks = await tiles.evaluateAll((elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return `${style.getPropertyValue('--sv-color-background')}|${style.fontFamily}`;
		})
	);
	expect(new Set(looks).size).toBe(5);
});

test('applying a pack themes the whole site and is remembered', async ({ page }) => {
	await page.goto('/theme-packs');
	await page
		.getByRole('group', { name: 'Apply Maison' })
		.getByRole('button', { name: 'Dark' })
		.click();

	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'maison-dark');
	await expect(page.getByRole('combobox', { name: 'Theme' })).toHaveValue('maison');
	await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
	expect(await page.evaluate(() => localStorage.getItem('sv-theme'))).toBe('maison-dark');
	expect(await htmlVar(page, '--sv-radius-md')).toBe('0px');

	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'maison-dark');
});

test('the theme select restyles the system theme', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
	expect(await htmlVar(page, '--sv-color-background')).toBe('oklch(0.985 0.002 260)');

	await page.getByRole('combobox', { name: 'Theme' }).selectOption('milano');
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
	await expect.poll(() => htmlVar(page, '--sv-color-background')).toBe('oklch(0.955 0.013 75)');
	expect(await htmlVar(page, '--sv-radius-md')).toBe('999px');
});

test('token tables report live values', async ({ page }) => {
	await page.goto('/theming/colors');
	const colour = page.getByRole('row').filter({ hasText: '--sv-color-text-subtle' });
	await expect(colour).toContainText('oklch(0.52 0.006 260)');
	await expect(colour.getByRole('cell').last()).toHaveText(/^\d+\.\d\d:1$/);

	await page.goto('/theming/contract');
	const contract = page.getByRole('row').filter({ hasText: '--sv-radius-md' });
	await expect(contract).toContainText('8px');
});

test('reduced motion wins over theme durations', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
	await page.goto('/theme-packs/maison');
	await page.getByRole('button', { name: 'Use Maison light' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'maison-light');
	expect(parseFloat(await htmlVar(page, '--sv-duration-slow'))).toBeLessThan(1);

	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
	expect(await htmlVar(page, '--sv-duration-slow')).toBe('450ms');
});
