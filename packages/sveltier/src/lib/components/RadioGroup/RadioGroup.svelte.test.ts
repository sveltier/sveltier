import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import RadioGroupHarness from '../../../tests/fixtures/RadioGroupHarness.svelte';

const group = () => page.getByRole('radiogroup', { name: 'Pay out' });
const radio = (name: string) => page.getByRole('radio', { name });
const shown = (testId: string) => page.getByTestId(testId);

describe('RadioGroup', () => {
	it('is a radiogroup named by its legend, whose radios keep the type of their values', async () => {
		const screen = await render(RadioGroupHarness);
		expect(group().element().tagName).toBe('FIELDSET');
		await expect.element(shown('value')).toHaveTextContent('null');
		await page.getByText('Every week').click();
		await expect.element(radio('Every week')).toBeChecked();
		await expect.element(shown('value')).toHaveTextContent('number:7');
		await screen.rerender({ value: 1 });
		await expect.element(radio('Every day')).toBeChecked();
	});

	// Whether the keys wrap past a disabled last radio is the platform's call (WebKit stops), so
	// only the moves every engine shares are checked.
	it('moves the choice with the arrow keys, as the platform does', async () => {
		await render(RadioGroupHarness, { value: 1 });
		await userEvent.keyboard('{Tab}');
		await expect.element(radio('Every day')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(radio('Every week')).toBeChecked();
		await expect.element(shown('value')).toHaveTextContent('number:7');
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(radio('Every day')).toBeChecked();
		await expect.element(radio('Every month')).toBeDisabled();
	});

	it('reads out each option hint with its radio, and the group hint with the group', async () => {
		await render(RadioGroupHarness, { hint: 'Payouts leave at 9:00' });
		await expect
			.element(radio('Every week'))
			.toHaveAccessibleDescription('Fewer, larger transfers');
		await expect.element(group()).toHaveAccessibleDescription('Payouts leave at 9:00');
	});

	it('needs a choice when required, says so, and submits the chosen value', async () => {
		await render(RadioGroupHarness, { required: true });
		// checkValidity() refuses the form without the browser's bubble, which in Firefox on Linux
		// swallows the next click, even in the next test.
		const first = radio('Every day').element() as HTMLInputElement;
		expect(first.form?.checkValidity()).toBe(false);
		// The first radio carries the group's message, and is the one a Form focuses.
		expect(first.validationMessage).toBe('Required');
		await page.getByText('Every week').click();
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('payout=7');
	});

	it('shows an error from outside in place of its hint, linked to the group', async () => {
		const screen = await render(RadioGroupHarness, { hint: 'Payouts leave at 9:00' });
		await screen.rerender({ error: 'Weekly payouts are paused' });
		await expect.element(page.getByText('Payouts leave at 9:00')).not.toBeInTheDocument();
		await expect.element(group()).toHaveAccessibleDescription('Weekly payouts are paused');
		await expect.element(group()).toHaveAttribute('aria-invalid', 'true');
	});

	it('goes back to the choice it started with on a form reset', async () => {
		await render(RadioGroupHarness, { value: 1 });
		await page.getByText('Every week').click();
		await expect.element(shown('value')).toHaveTextContent('number:7');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(shown('value')).toHaveTextContent('number:1');
		await expect.element(radio('Every day')).toBeChecked();
	});

	it('disables every radio when disabled, and lays them side by side when inline', async () => {
		const screen = await render(RadioGroupHarness, { disabled: true });
		await expect.element(radio('Every day')).toBeDisabled();
		await screen.rerender({ disabled: false, inline: true });
		const day = radio('Every day').element().getBoundingClientRect();
		const week = radio('Every week').element().getBoundingClientRect();
		expect(Math.abs(day.top - week.top)).toBeLessThan(1);
		expect(week.left).toBeGreaterThan(day.right);
	});
});
