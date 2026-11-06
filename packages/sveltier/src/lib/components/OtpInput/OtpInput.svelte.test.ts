import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import OtpInputHarness from '../../../tests/fixtures/OtpInputHarness.svelte';

const textbox = () => page.getByRole('textbox', { name: 'Verification code' });
const input = () => textbox().element() as HTMLInputElement;
const boxes = () => [...document.querySelectorAll<HTMLElement>('.sv-otp-input__box')];
const shown = (testId: string) => page.getByTestId(testId);
// What the boxes show, one character each, with "_" for an empty box.
const drawn = () =>
	boxes()
		.map((box) => box.textContent || '_')
		.join('');

describe('OtpInput', () => {
	it('is one input for the whole code, offered the code from a text message', async () => {
		await render(OtpInputHarness);
		expect(document.querySelectorAll('input:not([type=hidden])')).toHaveLength(1);
		// The attribute: Firefox leaves a token it does not support out of the property.
		expect(input().getAttribute('autocomplete')).toBe('one-time-code');
		expect(input().inputMode).toBe('numeric');
		expect(boxes()).toHaveLength(6);
		expect(boxes().every((box) => box.getAttribute('aria-hidden') === 'true')).toBe(true);
	});

	it('fills a box per digit typed, drops other characters, and binds the code', async () => {
		await render(OtpInputHarness);
		await textbox().click();
		await userEvent.keyboard('4a8-2');
		await expect.element(shown('value')).toHaveTextContent('482');
		expect(input().value).toBe('482');
		expect(drawn()).toBe('482___');
		expect(boxes()[3]?.classList).toContain('sv-otp-input__box--active');
	});

	it('takes a whole code at once, cleaned, and calls oncomplete once it is full', async () => {
		await render(OtpInputHarness);
		await textbox().fill('123-456');
		await expect.element(shown('value')).toHaveTextContent('123456');
		expect(drawn()).toBe('123456');
		await expect.element(shown('completed')).toHaveTextContent('123456');
		await textbox().fill('1234567');
		expect(input().value).toBe('123456');
		expect(shown('completed').element().textContent).toBe('123456');
	});

	it('removes the last character with Backspace, and completes again when refilled', async () => {
		await render(OtpInputHarness);
		await textbox().fill('123456');
		await textbox().click();
		await userEvent.keyboard('{Backspace}');
		await expect.element(shown('value')).toHaveTextContent('12345');
		await userEvent.keyboard('7');
		await expect.element(shown('completed')).toHaveTextContent('123456,123457');
	});

	it('completes again when a different code replaces a full one, not for the same code', async () => {
		await render(OtpInputHarness);
		await textbox().fill('111111');
		await textbox().fill('222222');
		await expect.element(shown('completed')).toHaveTextContent('111111,222222');
		await textbox().fill('222222');
		expect(shown('completed').element().textContent).toBe('111111,222222');
	});

	it('keeps the caret at the end, so the boxes fill in order', async () => {
		await render(OtpInputHarness);
		await textbox().click();
		await userEvent.keyboard('12{ArrowLeft}{ArrowLeft}3');
		await expect.element(shown('value')).toHaveTextContent('123');
	});

	it('clears the code with select all and Delete', async () => {
		await render(OtpInputHarness, { value: '123456' });
		await textbox().click();
		await userEvent.keyboard('{Control>}a{/Control}{Delete}');
		await expect.element(shown('value')).toHaveTextContent('');
		expect(drawn()).toBe('______');
	});

	it('takes letters and digits, uppercased, when alphanumeric', async () => {
		await render(OtpInputHarness, { type: 'alphanumeric', length: 4 });
		expect(input().inputMode).toBe('text');
		expect(boxes()).toHaveLength(4);
		await textbox().fill('ab-9z');
		await expect.element(shown('value')).toHaveTextContent('AB9Z');
	});

	it('is invalid while started but not finished, and when required and empty', async () => {
		await render(OtpInputHarness, { required: true });
		await textbox().click();
		await userEvent.keyboard('12');
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByText('Enter all 6 characters')).toBeVisible();
		await expect.element(textbox()).toHaveAttribute('aria-invalid', 'true');
		await expect.element(textbox()).toHaveAccessibleDescription('Enter all 6 characters');
		// A plain form refuses to submit with the same words. Checked without a click: Firefox's
		// bubble for the refused submit would take the next click in the test.
		expect(input().validationMessage).toBe('Enter all 6 characters');
		expect(input().form?.checkValidity()).toBe(false);
		await textbox().click();
		await textbox().fill('');
		await expect.element(page.getByText('Required')).toBeVisible();
		await textbox().fill('123456');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('code=123456');
	});

	it('runs the rules on a complete code only', async () => {
		await render(OtpInputHarness, {
			validateOn: 'input',
			rules: [(code: string) => code !== '000000' || 'This code has expired']
		});
		await textbox().fill('000');
		await expect.element(page.getByText('Enter all 6 characters')).toBeVisible();
		await textbox().fill('000000');
		await expect.element(page.getByText('This code has expired')).toBeVisible();
	});

	it('goes back to its first code on a form reset', async () => {
		await render(OtpInputHarness, { value: '12' });
		expect(drawn()).toBe('12____');
		await textbox().fill('987654');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(shown('value')).toHaveTextContent('12');
		expect(drawn()).toBe('12____');
	});

	it('shows a hint, and is muted when disabled', async () => {
		await render(OtpInputHarness, { hint: 'Sent to •••• 4821', disabled: true });
		await expect.element(textbox()).toHaveAccessibleDescription('Sent to •••• 4821');
		await expect.element(textbox()).toBeDisabled();
	});
});
