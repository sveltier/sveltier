import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

// The primitives demos, driven like a user would: they are the integration tests of the
// focus, layer and modality primitives in every engine.

test('the trapped panel keeps focus and gives it back', async ({ page }) => {
	await open(page, '/primitives/focus');
	const opener = page.getByRole('button', { name: 'Open the panel' });
	await opener.click();
	const amount = page.getByRole('textbox', { name: 'Amount' });
	await expect(amount).toBeFocused();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await expect(amount).toBeFocused();
	await page.getByRole('button', { name: 'Close' }).click();
	await expect(opener).toBeFocused();
});

test('the radio group is one tab stop and moves with the arrows', async ({ page }) => {
	await open(page, '/primitives/focus');
	const group = page.getByRole('radiogroup', { name: 'Chart range' });
	await group.getByRole('radio', { name: '1W' }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(group.getByRole('radio', { name: '1M' })).toBeFocused();
	await expect(group.getByRole('radio', { name: '1M' })).toHaveAttribute('aria-checked', 'true');
	await page.keyboard.press('End');
	await expect(group.getByRole('radio', { name: 'All' })).toBeFocused();
	await expect(group.locator('[tabindex="0"]')).toHaveCount(1);
});

test('nested layers close one at a time', async ({ page }) => {
	await open(page, '/primitives/layers');
	await page.getByRole('button', { name: 'Filters', exact: true }).click();
	await page.getByRole('button', { name: 'More filters' }).click();
	const filters = page.getByRole('group', { name: 'Filters', exact: true });
	const more = page.getByRole('group', { name: 'More filters' });
	await expect(more).toBeVisible();
	await page.getByRole('textbox', { name: 'Minimum amount' }).click();
	await expect(more).toBeHidden();
	await expect(filters).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(filters).toBeHidden();
});

test('the modal sheet locks the page and returns focus however it closes', async ({ page }) => {
	await open(page, '/primitives/modality');
	const opener = page.getByRole('button', { name: 'Review transfer' });
	const sheet = page.getByRole('dialog', { name: 'Confirm transfer' });

	await opener.click();
	await expect(sheet).toBeVisible();
	await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
	await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
	await page.keyboard.press('Escape');
	await expect(sheet).toBeHidden();
	await expect(opener).toBeFocused();
	await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');

	await opener.click();
	await expect(sheet).toBeVisible();
	await page.mouse.click(10, 10);
	await expect(sheet).toBeHidden();
	await expect(opener).toBeFocused();
});

test('the anchored popover sits against its trigger and follows side and alignment', async ({
	page
}) => {
	await open(page, '/primitives/positioning');
	const trigger = page.getByRole('button', { name: 'Account' });
	await trigger.scrollIntoViewIfNeeded();
	await trigger.click();
	const popover = page.getByRole('group', { name: 'Account' });
	await expect(popover).toBeVisible();

	const boxes = async () => ({
		anchor: (await trigger.boundingBox())!,
		floating: (await popover.boundingBox())!
	});
	const settles = (check: (b: Awaited<ReturnType<typeof boxes>>) => boolean) =>
		expect.poll(async () => check(await boxes())).toBe(true);
	const near = (a: number, b: number) => Math.abs(a - b) < 1.5;

	await settles(
		({ anchor, floating }) =>
			near(floating.y, anchor.y + anchor.height + 5) && near(floating.x, anchor.x)
	);
	await page.getByRole('radio', { name: 'top' }).check();
	await settles(({ anchor, floating }) => near(floating.y + floating.height, anchor.y - 5));
	await page.getByRole('group', { name: 'Align' }).getByRole('radio', { name: 'end' }).check();
	await settles(({ anchor, floating }) =>
		near(floating.x + floating.width, anchor.x + anchor.width)
	);

	await page.keyboard.press('Escape');
	await expect(popover).toBeHidden();
});

test('the listbox jumps by typing and selects with Enter', async ({ page }) => {
	await open(page, '/primitives/keyboard');
	const listbox = page.getByRole('listbox', { name: 'Account currency' });
	await listbox.getByRole('option', { name: 'Euro' }).focus();
	await page.keyboard.press('s');
	await expect(listbox.getByRole('option', { name: 'Singapore dollar' })).toBeFocused();
	await page.keyboard.press('s');
	await expect(listbox.getByRole('option', { name: 'Swiss franc' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(listbox.getByRole('option', { name: 'Swiss franc' })).toHaveAttribute(
		'aria-selected',
		'true'
	);
});

test('the receipt mounts and unmounts with each transition', async ({ page }) => {
	await open(page, '/primitives/motion');
	const toggle = page.getByRole('button', { name: 'Receipt' });
	const receipt = page.getByRole('group', { name: 'Transfer receipt' });
	await expect(receipt).toBeVisible();
	for (const kind of ['fade', 'pop', 'rise']) {
		await page.getByRole('radio', { name: kind }).check();
		await toggle.click();
		await expect(receipt).toBeHidden();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await toggle.click();
		await expect(receipt).toBeVisible();
	}
});

test('the springs settle on the other side of the split', async ({ page }) => {
	await open(page, '/primitives/motion');
	const shares = page.getByRole('list', { name: 'Equity share by spring preset' });
	await page.getByRole('button', { name: 'Rebalance' }).click();
	for (const preset of ['snappy', 'standard', 'gentle']) {
		await expect(shares.getByRole('listitem').filter({ hasText: preset })).toContainText('61.8%');
	}
});

test('the springs land at once when the user prefers reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await open(page, '/primitives/motion');
	const values = page
		.getByRole('list', { name: 'Equity share by spring preset' })
		.locator('.docs-num');
	await page.getByRole('button', { name: 'Rebalance' }).click();
	// Read once, without waiting: there is no animation to wait for.
	expect(await values.allTextContents()).toEqual(['61.8%', '61.8%', '61.8%']);
});

test('the ledger keeps a few rows in the page and jumps to any of them', async ({ page }) => {
	await open(page, '/primitives/virtual-lists');
	const ledger = page.getByRole('region', { name: 'Transactions' });
	const rows = ledger.getByRole('listitem');
	await expect(rows.first()).toHaveAttribute('aria-posinset', '1');
	expect(await rows.count()).toBeLessThan(30);
	await page.getByRole('spinbutton', { name: 'Row' }).fill('50000');
	await page.getByRole('button', { name: 'Go' }).click();
	await expect(ledger.locator('[aria-posinset="50000"]')).toBeVisible();
	await expect(rows.first()).not.toHaveAttribute('aria-posinset', '1');
	expect(await rows.count()).toBeLessThan(30);
});

test('the activity log measures its entries all the way to the end', async ({ page }) => {
	await open(page, '/primitives/virtual-lists');
	const log = page.getByRole('region', { name: 'Activity log' });
	await log.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
	await expect(log.locator('[aria-posinset="10000"]')).toBeVisible();
	// Once measured, every entry starts where the one before it ends.
	const gaps = () =>
		log.locator('li').evaluateAll((items) =>
			items.slice(1).map((item, i) => {
				const previous = items[i]!.getBoundingClientRect();
				return Math.round(Math.abs(item.getBoundingClientRect().top - previous.bottom));
			})
		);
	await expect.poll(async () => Math.max(...(await gaps()))).toBe(0);
});
