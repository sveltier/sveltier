import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CheckboxHarness from '../../../tests/fixtures/CheckboxHarness.svelte';

const box = () => page.getByRole('checkbox', { name: 'Email me a receipt' });
const input = () => box().element() as HTMLInputElement;
const shown = (testId: string) => page.getByTestId(testId);
const drawn = () => input().nextElementSibling as HTMLElement;

describe('Checkbox', () => {
	it('is a native checkbox named by its label, whose state binds both ways', async () => {
		const screen = await render(CheckboxHarness);
		expect(input().type).toBe('checkbox');
		await page.getByText('Email me a receipt').click();
		await expect.element(box()).toBeChecked();
		await expect.element(shown('checked')).toHaveTextContent('true');
		await screen.rerender({ checked: false });
		await expect.element(box()).not.toBeChecked();
	});

	it('toggles with Space, and draws the focus ring on the box', async () => {
		await render(CheckboxHarness);
		await userEvent.keyboard('{Tab}');
		await expect.element(box()).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect.element(shown('checked')).toHaveTextContent('true');
		expect(getComputedStyle(drawn()).outlineStyle).toBe('solid');
	});

	it('gives the whole label row as the target, at least 24px tall', async () => {
		await render(CheckboxHarness, { size: 'xs' });
		const row = input().closest('label') as HTMLElement;
		expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
		expect(row.contains(page.getByText('Email me a receipt').element())).toBe(true);
	});

	it('shows a dash while indeterminate, which a press clears', async () => {
		await render(CheckboxHarness, { indeterminate: true });
		expect(input().indeterminate).toBe(true);
		const dash = drawn().querySelector('.sv-checkbox__dash') as SVGElement;
		expect(getComputedStyle(dash).display).not.toBe('none');
		await box().click();
		await expect.element(shown('indeterminate')).toHaveTextContent('false');
		await expect.element(box()).toBeChecked();
		expect(getComputedStyle(dash).display).toBe('none');
	});

	it('must be checked when required, and submits its value once it is', async () => {
		await render(CheckboxHarness, { required: true, value: 'yes' });
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('');
		expect(input().validationMessage).toBe('Required');
		await box().click();
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('receipt=yes');
	});

	it('shows its message as soon as the user unchecks it, since a toggle is a whole edit', async () => {
		await render(CheckboxHarness, { required: true, checked: true });
		await box().click();
		await expect.element(box()).toHaveAttribute('aria-invalid', 'true');
		const message = page.getByText('Required', { exact: true });
		await expect.element(message).toBeVisible();
		expect(input().getAttribute('aria-describedby')).toBe(message.element().id);
		// The pointer is still over the box, and its border stays the error colour.
		const error = getComputedStyle(message.element()).color;
		expect(getComputedStyle(drawn()).borderTopColor).toBe(error);
		await box().click();
		await expect.element(message).not.toBeInTheDocument();
	});

	it('links its hint, and shows an error from outside in its place', async () => {
		const screen = await render(CheckboxHarness, { hint: 'Sent to your inbox' });
		const hint = page.getByText('Sent to your inbox');
		expect(input().getAttribute('aria-describedby')).toBe(hint.element().id);
		await screen.rerender({ error: 'Receipts are paused' });
		await expect.element(hint).not.toBeInTheDocument();
		await expect.element(box()).toHaveAccessibleDescription('Receipts are paused');
		await expect.element(box()).toHaveAttribute('aria-invalid', 'true');
	});

	it('goes back to the state it started in on a form reset', async () => {
		await render(CheckboxHarness, { checked: true });
		await box().click();
		await expect.element(shown('checked')).toHaveTextContent('false');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(shown('checked')).toHaveTextContent('true');
		await expect.element(box()).toBeChecked();
	});

	it('cannot be toggled while disabled', async () => {
		await render(CheckboxHarness, { disabled: true });
		await expect.element(box()).toBeDisabled();
		await page.getByText('Email me a receipt').click({ force: true });
		await expect.element(shown('checked')).toHaveTextContent('false');
	});
});
