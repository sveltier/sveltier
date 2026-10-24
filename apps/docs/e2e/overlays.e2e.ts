import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

/** The WCAG 2.2 A/AA violations on the page as it is. */
async function violations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	return results.violations.map((v) => `${v.id}: ${v.help}`);
}

// The overlay demos, driven like a user would, in every engine.

test('a dialog opens from its trigger, focuses its field, and gives focus back on Escape', async ({
	page
}) => {
	await open(page, '/overlays/dialog');
	const trigger = page.getByRole('button', { name: 'Rename' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Rename the account' });
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole('textbox', { name: 'Account name' })).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
});

// The page sweep sees every overlay closed; these check them open, in both colour schemes.
for (const colorScheme of ['light', 'dark'] as const) {
	test(`an open dialog has no axe violations (${colorScheme})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await open(page, '/overlays/dialog');
		await page.getByRole('button', { name: 'Delete card' }).click();
		await expect(page.getByRole('dialog', { name: 'Delete this card?' })).toBeVisible();
		expect(await violations(page)).toEqual([]);
	});

	test(`an open popover has no axe violations (${colorScheme})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await open(page, '/overlays/popover');
		await page.getByRole('button', { name: 'Amount' }).click();
		await expect(page.getByRole('dialog', { name: 'Amount range' })).toBeVisible();
		expect(await violations(page)).toEqual([]);
	});

	test(`an open menu has no axe violations (${colorScheme})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await open(page, '/overlays/menu');
		await page.getByRole('button', { name: 'Account actions' }).click();
		await expect(page.getByRole('menu', { name: 'Account actions' })).toBeVisible();
		expect(await violations(page)).toEqual([]);
	});

	test(`a shown tooltip has no axe violations (${colorScheme})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await open(page, '/overlays/tooltip');
		await page.getByRole('button', { name: 'Freeze card' }).hover();
		await expect(page.getByRole('tooltip')).toBeVisible();
		expect(await violations(page)).toEqual([]);
	});
}

test('a sheet slides in from the end, keeps its choices, and closes on Escape', async ({
	page
}) => {
	await open(page, '/overlays/sheet');
	const trigger = page.getByRole('button', { name: 'Filters' });
	await trigger.click();
	const sheet = page.getByRole('dialog', { name: 'Filters' });
	await sheet.getByRole('checkbox', { name: 'Pending payments only' }).check();
	await page.keyboard.press('Escape');
	await expect(sheet).toBeHidden();
	await expect(trigger).toBeFocused();
	await expect(page.getByText('pending = true')).toBeVisible();
});

test('a confirmation dialog runs its action and closes', async ({ page }) => {
	await open(page, '/overlays/dialog');
	await page.getByRole('button', { name: 'Delete card' }).click();
	const dialog = page.getByRole('dialog', { name: 'Delete this card?' });
	await dialog.getByRole('button', { name: 'Delete' }).click();
	await expect(dialog).toBeHidden();
	await expect(page.getByText('deleted = true')).toBeVisible();
});

test('a tooltip shows when the pointer rests on its button, and Escape hides it', async ({
	page
}) => {
	await open(page, '/overlays/tooltip');
	const copy = page.locator('.docs-demo').getByRole('button', { name: 'Copy', exact: true });
	await expect(copy).toHaveAccessibleDescription('Copy the IBAN');
	await copy.hover();
	const tooltip = page.getByRole('tooltip', { name: 'Copy the IBAN' });
	await expect(tooltip).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(tooltip).toBeHidden();
});

test('a popover filters by amount, and Escape gives focus back to its trigger', async ({
	page
}) => {
	await open(page, '/overlays/popover');
	const trigger = page.getByRole('button', { name: 'Amount' });
	await trigger.click();
	const popover = page.getByRole('dialog', { name: 'Amount range' });
	await expect(popover.getByRole('spinbutton', { name: 'From' })).toBeFocused();
	await page.keyboard.type('100');
	await popover.getByRole('button', { name: 'Apply' }).click();
	await expect(popover).toBeHidden();
	await expect(page.getByText('100 to ∞')).toBeVisible();
	await trigger.click();
	await page.keyboard.press('Escape');
	await expect(popover).toBeHidden();
	await expect(trigger).toBeFocused();
});

test('a menu opens from the keyboard and runs the chosen action', async ({ page }) => {
	await open(page, '/overlays/menu');
	const trigger = page.getByRole('button', { name: 'Account actions' });
	await trigger.focus();
	await page.keyboard.press('ArrowDown');
	const menu = page.getByRole('menu', { name: 'Account actions' });
	await expect(menu.getByRole('menuitem', { name: /^Rename/ })).toBeFocused();
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(menu).toBeHidden();
	await expect(trigger).toBeFocused();
	await expect(page.getByText('"duplicate"')).toBeVisible();
});
