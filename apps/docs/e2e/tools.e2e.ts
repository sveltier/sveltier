import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

test.describe('Playground', () => {
	test('a control changes the preview, the code and the address', async ({ page }) => {
		await open(page, '/tools/playground');
		const preview = page.getByTestId('playground-preview');
		const code = page.locator('pre').first();
		await expect(code).toContainText('<Button>Continue</Button>');

		await page.getByLabel('variant', { exact: true }).selectOption('tonal');
		await page.getByRole('switch', { name: 'disabled', exact: true }).click();

		await expect(preview.getByRole('button', { name: 'Continue' })).toBeDisabled();
		await expect(code).toContainText('<Button variant="tonal" disabled>Continue</Button>');
		await expect(page).toHaveURL(/#Button\?variant=tonal&disabled=true$/);
	});

	test('a link opens the configuration it holds', async ({ page }) => {
		await open(page, '/tools/playground#Amount?value=-42.5&decimals=3');
		await expect(page.getByTestId('playground-preview')).toContainText('−42.500');
		await expect(page.locator('pre').first()).toContainText(
			'<Amount value={-42.5} decimals={3} />'
		);
		await expect(page.getByLabel('Component')).toHaveText(/Amount/);
	});

	test('picking another component starts from its own example', async ({ page }) => {
		await open(page, '/tools/playground');
		await page.getByLabel('Component').click();
		await page.getByRole('option', { name: 'SecureMask' }).click();
		const preview = page.getByTestId('playground-preview');
		await expect(preview).toContainText('3000');
		await expect(preview).not.toContainText('DE89');
		await expect(page.locator('pre').first()).toContainText(
			'<SecureMask value="DE89370400440532013000" label="IBAN" toggle />'
		);
		await expect(page).toHaveURL(/#SecureMask\?/);
	});
});

test.describe('Theme builder', () => {
	test('a colour changes the preview, the contrast and the code', async ({ page }) => {
		await open(page, '/tools/theme-builder');
		const preview = page.getByTestId('builder-preview');
		const deposit = preview.getByRole('button', { name: 'Deposit' });
		const code = page.locator('pre').last();
		await expect(code).toContainText('defineTheme(\n  {},\n  monolithLight\n)');

		const fill = () => deposit.evaluate((element) => getComputedStyle(element).backgroundColor);
		const before = await fill();

		await page.getByLabel('primary in OKLCH').fill('oklch(0.55 0.2 145)');

		// Engines write the computed colour in different forms; that it changed is what matters.
		await expect.poll(fill).not.toBe(before);
		await expect(code).toContainText("primary: 'oklch(0.55 0.2 145)'");
		await expect(page.getByText(/pairs? (is|are) under 4\.5:1/)).toBeVisible();
		await expect(page).toHaveURL(/#primary=oklch/);
	});

	test('a link restores the base theme and the changes', async ({ page }) => {
		await open(
			page,
			'/tools/theme-builder#pack=aurora&mode=dark&primary=oklch(0.8+0.15+80)&radius=0'
		);
		const code = page.locator('pre').last();
		await expect(code).toContainText("import { auroraDark } from '@sveltier/ui/themes/aurora';");
		await expect(code).toContainText("primary: 'oklch(0.8 0.15 80)'");
		await expect(code).toContainText("'radius-md': '0px'");
		const preview = page.getByTestId('builder-preview');
		await expect(preview).toHaveCSS('color-scheme', 'dark');
		await expect(preview.getByRole('button', { name: 'Deposit' })).toHaveCSS(
			'border-top-left-radius',
			'0px'
		);
		await expect(
			page.getByText('Every pair reaches 4.5:1, as the built-in themes do.')
		).toBeVisible();
	});
});
