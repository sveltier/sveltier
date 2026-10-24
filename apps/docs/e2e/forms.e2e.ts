import { expect, test, type Page } from '@playwright/test';

/** Opens a page and waits until it has hydrated: the root theme is applied after mount. */
async function open(page: Page, path: string) {
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
}

// The form demos, driven like a user would, in every engine.

test('a text field shows its message when the user leaves it, and clears it once fixed', async ({
	page
}) => {
	await open(page, '/forms/text-field');
	const email = page.getByRole('textbox', { name: 'Email' });
	await email.fill('ada');
	await expect(email).toHaveAccessibleDescription('Receipts go to this address');
	await email.press('Tab');
	await expect(page.getByLabel('Password')).toBeFocused();
	await expect(email).toHaveAccessibleDescription('Enter a valid email address');
	await expect(email).toHaveAttribute('aria-invalid', 'true');
	await email.fill('ada@example.com');
	await expect(email).toHaveAccessibleDescription('Receipts go to this address');
	await expect(email).not.toHaveAttribute('aria-invalid');
});

test('a rule speaks after the constraints, with its own words', async ({ page }) => {
	await open(page, '/forms/text-field');
	const password = page.getByLabel('Password');
	await password.fill('short');
	// The reveal button is inside the field, so moving to it is not leaving the field.
	await password.press('Tab');
	await expect(page.getByRole('button', { name: 'Show' })).toBeFocused();
	await expect(password).toHaveAccessibleDescription('At least 8 characters, with a digit');
	await page.keyboard.press('Tab');
	await expect(password).toHaveAccessibleDescription('Enter at least 8 characters');
	await password.fill('long enough');
	await expect(password).toHaveAccessibleDescription('Include at least one digit');
	await password.fill('long enough 1');
	await expect(password).toHaveAccessibleDescription('At least 8 characters, with a digit');
});

test('a server answer shows at once and clears when the user types', async ({ page }) => {
	await open(page, '/forms/text-field');
	const username = page.getByRole('textbox', { name: 'Username' });
	await username.fill('ada');
	await page.getByRole('button', { name: 'Check' }).click();
	await expect(username).toHaveAccessibleDescription('“ada” is taken');
	await username.fill('ada_lovelace');
	await expect(username).toHaveAccessibleDescription(/^Lowercase letters/);
});

test('the field variants are typed and listed in the API table', async ({ page }) => {
	await open(page, '/forms/text-field');
	const table = page.getByRole('region', { name: 'TextField props' });
	await expect(table.getByRole('row').filter({ hasText: /^variant/ })).toContainText(
		"'outlined' | 'tonal' | 'elevated' | 'text' | 'plain'"
	);
	await expect(table.getByRole('row').filter({ hasText: /^ref/ })).toContainText(
		'HTMLInputElement | null'
	);
});

test('a field labels and describes a control of your own', async ({ page }) => {
	await open(page, '/forms/field');
	const date = page.getByLabel('Start date');
	await expect(date).toHaveAttribute('type', 'date');
	await expect(date).toHaveAccessibleDescription('The first payment goes out on this day');
	await expect(date).toHaveJSProperty('required', true);
});

test('a form stops an invalid submission and focuses the first problem', async ({ page }) => {
	await open(page, '/forms/form');
	const email = page.getByRole('textbox', { name: 'Email' });
	await email.fill('ada');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(email).toBeFocused();
	await expect(email).toHaveAccessibleDescription('Enter a valid email address');
	await expect(page.getByLabel('Password')).toHaveAccessibleDescription('Required');
});

test('a valid form submits, and the server answer shows on its field', async ({ page }) => {
	await open(page, '/forms/form');
	const email = page.getByRole('textbox', { name: 'Email' });
	await email.fill('ada@example.com');
	await page.getByLabel('Password').fill('correct horse');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(email).toHaveAccessibleDescription('An account with this email already exists');
	await email.fill('grace@example.com');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Account created for grace@example.com.')).toBeVisible();
});

test('a textarea grows with its text', async ({ page }) => {
	await open(page, '/forms/textarea');
	const note = page.getByRole('textbox', { name: 'Note to the payee' });
	const start = (await note.boundingBox())!.height;
	await note.fill('One\nTwo\nThree\nFour');
	await expect.poll(async () => (await note.boundingBox())!.height).toBeGreaterThan(start);
	await expect(page.getByText('18 / 280 characters in the note.')).toBeVisible();
});

test('a number field reads the locale format and steps with the keys', async ({ page }) => {
	await open(page, '/forms/number-field');
	const amount = page.getByRole('spinbutton', { name: 'Amount' });
	await amount.fill('1234.5');
	await amount.press('Tab');
	await expect(amount).toHaveValue('1,234.50');
	await expect(page.getByText('amount = 1234.5')).toBeVisible();
	const quantity = page.getByRole('spinbutton', { name: 'Quantity' });
	await quantity.focus();
	await quantity.press('ArrowUp');
	await expect(quantity).toHaveValue('2');
	await quantity.press('End');
	await expect(quantity).toHaveValue('99');
});

test('a native select keeps the type of its values', async ({ page }) => {
	await open(page, '/forms/native-select');
	await page.getByRole('combobox', { name: 'Repeat' }).selectOption({ label: 'Every year' });
	await expect(page.getByText('days = 365')).toBeVisible();
	const country = page.getByRole('combobox', { name: 'Country' });
	await expect(page.getByText('country = null')).toBeVisible();
	await country.selectOption({ label: 'Vietnam' });
	await expect(page.getByText('country = "vn"')).toBeVisible();
});

test('a select-all checkbox shows a dash for part of its list and checks it all', async ({
	page
}) => {
	await open(page, '/forms/checkbox');
	const all = page.getByRole('checkbox', { name: 'All documents' });
	const dashed = () => all.evaluate((input: HTMLInputElement) => input.indeterminate);
	expect(await dashed()).toBe(true);
	await all.click();
	await expect(page.getByRole('checkbox', { name: 'Tax forms' })).toBeChecked();
	await expect(
		page.getByText('chosen = ["Statements","Tax forms","Trade confirmations"]')
	).toBeVisible();
	await page.getByRole('checkbox', { name: 'Statements' }).click();
	expect(await dashed()).toBe(true);
	await expect(all).not.toBeChecked();
});

test('a checkbox whose label holds a link is named by the whole label', async ({ page }) => {
	await open(page, '/forms/checkbox');
	const licence = page.getByRole('checkbox', { name: 'I accept the licence terms' });
	// The start of the label, away from the link, which would navigate instead.
	await page
		.locator('.docs-demo')
		.getByText('I accept the')
		.click({ position: { x: 4, y: 4 } });
	await expect(licence).toBeChecked();
	await expect(page.getByRole('link', { name: 'licence terms' })).toHaveAttribute(
		'href',
		/LICENSE$/
	);
});
