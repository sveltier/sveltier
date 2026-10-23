import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

// The component demos, driven like a user would: integration tests of each component in the
// prerendered docs, in every engine.

test('a loading button ignores a second press', async ({ page }) => {
	await open(page, '/components/button');
	const pay = page.getByRole('button', { name: /^Pay invoice/ });
	await pay.click();
	await pay.click({ force: true });
	await expect(pay).toHaveAttribute('aria-disabled', 'true');
	await expect(pay).toHaveAccessibleName('Pay invoice Loading');
	await expect(page.getByText('Paid 1 time.')).toBeVisible();
	await expect(pay).not.toHaveAttribute('aria-disabled');
	await expect(page.getByText(/Paid 2 times/)).toHaveCount(0);
});

test('a button is pressed with the keyboard and keeps focus while it loads', async ({ page }) => {
	await open(page, '/components/button');
	const pay = page.getByRole('button', { name: /^Pay invoice/ });
	await pay.focus();
	await page.keyboard.press('Enter');
	await expect(pay).toHaveAttribute('aria-disabled', 'true');
	await expect(pay).toBeFocused();
	// The disabled button is not in the tab order. (WebKit, like Safari, also skips links.)
	const disabled = page.getByRole('button', { name: 'Disabled' });
	await expect(disabled).toBeDisabled();
	await page.keyboard.press('Tab');
	await expect(pay).not.toBeFocused();
	await expect(disabled).not.toBeFocused();
	await expect(page.getByText('Paid 1 time.')).toBeVisible();
});

test('the API table is generated from the types', async ({ page }) => {
	await open(page, '/components/button');
	const table = page.getByRole('region', { name: 'Button props' });
	const variant = table.getByRole('row').filter({ hasText: /^variant/ });
	await expect(variant).toContainText(
		"'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'"
	);
	await expect(table.getByRole('row').filter({ hasText: /^loading/ })).toContainText('false');
	await expect(table.getByRole('row').filter({ hasText: /^ref/ })).toContainText(
		'HTMLButtonElement | HTMLAnchorElement | null'
	);
});

test('icons are hidden from assistive technology unless labelled', async ({ page }) => {
	await open(page, '/components/icon');
	await expect(page.getByRole('img', { name: 'Card payment' })).toBeVisible();
	const decorative = page.locator('.sv-icon[aria-hidden="true"]');
	expect(await decorative.count()).toBeGreaterThan(10);
});

test('a badge describes the button it is pinned to and hides at zero', async ({ page }) => {
	await open(page, '/components/badge');
	const messages = page.getByRole('button', { name: 'Messages' });
	await expect(messages).toHaveAccessibleDescription('3 unread messages');
	const read = page.getByRole('button', { name: 'Read one' });
	for (let i = 0; i < 3; i++) await read.click();
	await expect(page.locator('#inbox .sv-badge__badge')).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Alerts' })).toHaveAccessibleDescription(
		'120 alerts'
	);
});
