import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TimeFieldHarness from '../../../tests/fixtures/TimeFieldHarness.svelte';

const field = () => page.getByRole('spinbutton', { name: 'Opened at' });
const input = () => field().element() as HTMLInputElement;
const value = () => page.getByTestId('value');
const leave = () => userEvent.keyboard('{Tab}');

describe('TimeField', () => {
	it('reads a time typed key by key once its minutes are whole, and writes it in the locale format', async () => {
		await render(TimeFieldHarness, {});
		expect(input().placeholder).toBe('hh:mm AM');
		input().focus();
		// 9 and 9:3 are on the way; 9:30 is a whole time on the 24-hour clock, until pm.
		await userEvent.keyboard('9:30 pm');
		await expect.element(value()).toHaveTextContent('21:30');
		expect(page.getByTestId('changes').element().textContent).toBe('09:30, 21:30');
		await leave();
		expect(input().value).toBe('09:30 PM');
		await expect.element(field()).toHaveAttribute('aria-valuetext', '09:30 PM');
	});

	it('reads hours alone when the field is left', async () => {
		await render(TimeFieldHarness, {});
		await field().fill('9');
		await expect.element(value()).toHaveTextContent('null');
		await leave();
		await expect.element(value()).toHaveTextContent('09:00');
		expect(input().value).toBe('09:00 AM');
	});

	it('steps by its step from min with the arrows, an hour with the page keys, within max', async () => {
		await render(TimeFieldHarness, { value: '09:10', min: '08:00', max: '18:00', step: 15 });
		input().focus();
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('09:15');
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expect.element(value()).toHaveTextContent('08:45');
		await userEvent.keyboard('{PageUp}');
		await expect.element(value()).toHaveTextContent('09:45');
		await userEvent.keyboard('{End}');
		await expect.element(value()).toHaveTextContent('18:00');
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('18:00');
		await userEvent.keyboard('{Home}');
		await expect.element(value()).toHaveTextContent('08:00');
		expect(input().value).toBe('08:00 AM');
	});

	it('says when a time is off its limits or steps', async () => {
		await render(TimeFieldHarness, { min: '08:00', step: 15 });
		await field().fill('07:30');
		await leave();
		await expect.element(field()).toHaveAccessibleDescription('Enter 08:00 AM or later');
		await field().fill('08:20');
		await expect
			.element(field())
			.toHaveAccessibleDescription('Enter a time in steps of 15 minutes');
		await field().fill('8 o clock');
		await expect.element(field()).toHaveAccessibleDescription('Enter a time as hh:mm AM');
	});

	it('goes back to the time it started with when its form is reset', async () => {
		await render(TimeFieldHarness, { value: '09:30' });
		await field().fill('10:45');
		await expect.element(value()).toHaveTextContent('10:45');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(value()).toHaveTextContent('09:30');
		expect(input().value).toBe('09:30 AM');
	});

	it('writes a time set from outside, and submits HH:mm', async () => {
		const { rerender } = await render(TimeFieldHarness, { value: '09:30' });
		await rerender({ value: '16:00' });
		await expect.poll(() => input().value).toBe('04:00 PM');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('at=16%3A00');
	});
});
