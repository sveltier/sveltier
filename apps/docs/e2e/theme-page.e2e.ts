import { expect, test } from '@playwright/test';

const bg = (selector: string) =>
	`getComputedStyle(document.querySelector(${JSON.stringify(selector)})).getPropertyValue('--sv-color-background').trim()`;

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/theme');
});

test('each combination tile paints its own nested theme', async ({ page }) => {
	const tiles = page.locator('.docs-combo');
	await expect(tiles).toHaveCount(4);
	const values = await tiles.evaluateAll((elements) =>
		elements.map((element) =>
			getComputedStyle(element).getPropertyValue('--sv-color-background').trim()
		)
	);
	expect(new Set(values).size).toBe(4);
	await expect(tiles.nth(0)).toHaveAttribute('data-sv-theme', 'ink-champagne');
});

test('applying a combination themes the whole site and is remembered', async ({ page }) => {
	const tile = page.locator('.docs-combo[data-sv-theme="ink-verdigris"]');
	await tile.getByRole('button', { name: 'Apply to site' }).click();

	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'ink-verdigris');
	await expect(tile.getByRole('button', { name: 'Applied' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(page.getByRole('radio', { name: 'Ink', exact: true })).toBeChecked();
	await expect(page.getByRole('radio', { name: 'Verdigris' })).toBeChecked();
	expect(await page.evaluate(() => localStorage.getItem('sv-theme'))).toBe('ink-verdigris');
	expect(await page.evaluate(bg('html'))).toBe('oklch(0.175 0.010 190)');
});

test('the accent switch re-tints the system theme', async ({ page }) => {
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
	expect(await page.evaluate(bg('html'))).toBe('oklch(0.945 0.010 78)');

	await page.getByRole('radio', { name: 'Verdigris' }).check();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
	await expect.poll(() => page.evaluate(bg('html'))).toBe('oklch(0.945 0.010 190)');
});

test('the token table reports live values', async ({ page }) => {
	const row = page.getByRole('row').filter({ hasText: '--sv-color-text-subtle' });
	await expect(row).toContainText('oklch(0.50 0.012 78)');
	await expect(row.getByRole('cell').last()).toHaveText(/^\d+\.\d\d:1$/);
});
