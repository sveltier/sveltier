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

test('an avatar falls back to its initials when the picture fails', async ({ page }) => {
	await open(page, '/components/avatar');
	await expect(page.getByRole('img', { name: 'Alex Morgan' }).locator('img')).toBeVisible();
	const failed = page.getByRole('img', { name: 'Jamie Kerr' });
	await expect(failed.locator('img')).toHaveCount(0);
	await expect(failed).toHaveText('JK');
});

test('filter chips toggle and removable chips go away', async ({ page }) => {
	await open(page, '/components/chip');
	const transfer = page.getByRole('button', { name: 'Transfer', exact: true });
	await expect(transfer).toHaveAttribute('aria-pressed', 'false');
	await transfer.click();
	await expect(transfer).toHaveAttribute('aria-pressed', 'true');
	await expect(page.getByText('2 of 4 transaction types shown.')).toBeVisible();
	await page.getByRole('button', { name: 'Remove GBP' }).click();
	await expect(page.getByRole('button', { name: 'Remove GBP' })).toHaveCount(0);
	await expect(page.getByRole('group', { name: 'Watched currencies' })).not.toContainText('GBP');
});

test('a progress bar reports how far the upload has got', async ({ page }) => {
	await open(page, '/components/progress');
	const bar = page.getByRole('progressbar', { name: 'Uploading statement' });
	await expect(bar).toHaveAttribute('aria-valuenow', '0');
	await page.getByRole('button', { name: 'Upload statement' }).click();
	await expect(bar).toHaveAttribute('aria-valuenow', '100');
	await expect(page.getByRole('progressbar', { name: 'Syncing transactions' })).not.toHaveAttribute(
		'aria-valuenow'
	);
});

test('a skeleton holds the place of content while its region is busy', async ({ page }) => {
	await open(page, '/components/skeleton');
	const card = page.getByRole('region', { name: 'Latest transfer' });
	await expect(card).toHaveAttribute('aria-busy', 'true');
	await expect(card.locator('.sv-skeleton')).toHaveCount(3);
	await page.getByRole('button', { name: 'Finish loading' }).click();
	await expect(card).toHaveAttribute('aria-busy', 'false');
	await expect(card).toContainText('Alex Morgan');
});

test('an error alert is announced at once and a closed alert can come back', async ({ page }) => {
	await open(page, '/components/alert');
	await expect(page.getByRole('alert').filter({ hasText: 'Payment declined' })).toBeVisible();
	await expect(page.getByRole('status').filter({ hasText: 'Transfer sent' })).toBeVisible();
	await page.getByRole('button', { name: 'Dismiss tip' }).click();
	await expect(page.getByText('Tip: press')).toHaveCount(0);
	await page.getByRole('button', { name: 'Show the tip again' }).click();
	await expect(page.getByText('Tip: press')).toBeVisible();
});

test('a card titled with a level is in the page outline', async ({ page }) => {
	await open(page, '/components/card');
	await expect(page.getByRole('heading', { level: 3, name: 'Savings' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Savings options' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Add money' })).toBeVisible();
});

test('a navigation list marks the row the user picked', async ({ page }) => {
	await open(page, '/components/list');
	const nav = page.getByRole('navigation', { name: 'Banking' });
	await nav.getByRole('button', { name: 'Cards' }).click();
	await expect(page.getByText('Showing Cards.')).toBeVisible();
	await expect(nav.getByRole('button', { name: 'Loans' })).toBeDisabled();
	expect(await nav.getByRole('listitem').count()).toBe(4);
});

test('a button group is a named set of buttons', async ({ page }) => {
	await open(page, '/components/button-group');
	const sort = page.getByRole('group', { name: 'Sort' });
	await sort.getByRole('button', { name: 'Sort descending' }).click();
	await expect(page.getByText('Sorted descending.')).toBeVisible();
	await expect(page.getByRole('group', { name: 'Export' }).getByRole('button')).toHaveCount(3);
});
