import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DateTimeFieldHarness from '../../../tests/fixtures/DateTimeFieldHarness.svelte';

const dateField = () => page.getByRole('textbox', { name: 'Opened Date' });
const timeField = () => page.getByRole('spinbutton', { name: 'Opened Time' });
const value = () => page.getByTestId('value');
const text = (locator: ReturnType<typeof dateField>) =>
	(locator.element() as HTMLInputElement).value;

describe('DateTimeField', () => {
	it('sets the value once both the date and the time are there', async () => {
		await render(DateTimeFieldHarness, {});
		await dateField().fill('10/26/2026');
		await expect.element(value()).toHaveTextContent('null');
		await timeField().fill('14:05');
		await expect.element(value()).toHaveTextContent('2026-10-26T14:05');
		expect(page.getByTestId('changes').element().textContent).toBe('2026-10-26T14:05');
	});

	it('does not leave the field going from the date to the time, and asks for both', async () => {
		await render(DateTimeFieldHarness, {});
		await dateField().fill('10/26/2026');
		await userEvent.keyboard('{Tab}');
		await expect.element(timeField()).toHaveFocus();
		expect(document.querySelector('.sv-field__error')).toBeNull();
		// Past the time, on to the calendar button, the field is left.
		await userEvent.keyboard('{Tab}');
		await expect.element(timeField()).toHaveAccessibleDescription('Enter a date and a time');
	});

	it('checks min and max on the whole value, in the locale format', async () => {
		await render(DateTimeFieldHarness, { min: '2026-10-26T09:30' });
		await dateField().fill('10/26/2026');
		await timeField().fill('09:00');
		await userEvent.keyboard('{Tab}');
		await expect
			.element(timeField())
			.toHaveAccessibleDescription('Enter 10/26/2026 09:30 AM or later');
	});

	it('steps the time with the arrows and finishes short text when left', async () => {
		await render(DateTimeFieldHarness, { value: '2026-10-26T09:30', step: 15 });
		(timeField().element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('2026-10-26T09:45');
		await dateField().fill('1/5/27');
		await userEvent.keyboard('{Tab}');
		await expect.element(value()).toHaveTextContent('2027-01-05T09:45');
		expect(text(dateField())).toBe('01/05/2027');
	});

	it('fills the date from the calendar and hands focus on to the time', async () => {
		await render(DateTimeFieldHarness, { value: '2026-10-26T09:30' });
		await page.getByRole('button', { name: 'Choose a date' }).click();
		await expect
			.poll(() => (document.activeElement as HTMLElement).dataset.date)
			.toBe('2026-10-26');
		await userEvent.keyboard('{ArrowRight}{Enter}');
		await expect.element(value()).toHaveTextContent('2026-10-27T09:30');
		await expect.element(timeField()).toHaveFocus();
	});

	it('goes back to its first value on reset, and submits YYYY-MM-DDTHH:mm', async () => {
		await render(DateTimeFieldHarness, { value: '2026-10-26T09:30' });
		await timeField().fill('16:00');
		await expect.element(value()).toHaveTextContent('2026-10-26T16:00');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(value()).toHaveTextContent('2026-10-26T09:30');
		expect(text(timeField())).toBe('09:30 AM');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect
			.element(page.getByTestId('submitted'))
			.toHaveTextContent('opened=2026-10-26T09%3A30');
	});
});
