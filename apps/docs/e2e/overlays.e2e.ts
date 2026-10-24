import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
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

// The page sweep sees the dialogs closed; this checks one open, in both colour schemes.
for (const colorScheme of ['light', 'dark'] as const) {
	test(`an open dialog has no axe violations (${colorScheme})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await open(page, '/overlays/dialog');
		await page.getByRole('button', { name: 'Delete card' }).click();
		await expect(page.getByRole('dialog', { name: 'Delete this card?' })).toBeVisible();
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});
}

test('a confirmation dialog runs its action and closes', async ({ page }) => {
	await open(page, '/overlays/dialog');
	await page.getByRole('button', { name: 'Delete card' }).click();
	const dialog = page.getByRole('dialog', { name: 'Delete this card?' });
	await dialog.getByRole('button', { name: 'Delete' }).click();
	await expect(dialog).toBeHidden();
	await expect(page.getByText('deleted = true')).toBeVisible();
});
