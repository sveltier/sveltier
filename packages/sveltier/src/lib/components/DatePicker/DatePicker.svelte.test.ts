import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DatePickerHarness from '../../../tests/fixtures/DatePickerHarness.svelte';

const field = () => page.getByRole('textbox', { name: 'Trade date' });
const input = () => field().element() as HTMLInputElement;
const button = () => page.getByRole('button', { name: 'Choose a date' });
const value = () => page.getByTestId('value');
const leave = () => userEvent.keyboard('{Tab}');

describe('DatePicker', () => {
	it("reads a date typed in the locale's order, and writes it back in the locale's format", async () => {
		await render(DatePickerHarness, {});
		expect(input().placeholder).toBe('mm/dd/yyyy');
		await field().fill('10/26/2026');
		await expect.element(value()).toHaveTextContent('2026-10-26');
		await field().fill('2026-1-5');
		await field().fill('2026-01-05');
		await expect.element(value()).toHaveTextContent('2026-01-05');
		input().focus();
		await leave();
		expect(input().value).toBe('01/05/2026');
	});

	it('changes once for a date typed key by key, not for the dates on the way to it', async () => {
		await render(DatePickerHarness, {});
		input().focus();
		// At 10/26/20 the text is a whole date in 2020, on the way to 2026.
		await userEvent.keyboard('10/26/2026');
		await expect.element(value()).toHaveTextContent('2026-10-26');
		expect(page.getByTestId('changes').element().textContent).toBe('2026-10-26');
	});

	it('reads a two-digit year and a one-digit day when the field is left', async () => {
		await render(DatePickerHarness, {});
		await field().fill('1/5/26');
		await expect.element(value()).toHaveTextContent('null');
		await leave();
		await expect.element(value()).toHaveTextContent('2026-01-05');
		expect(input().value).toBe('01/05/2026');
	});

	it('goes back to the date it started with when its form is reset', async () => {
		await render(DatePickerHarness, { value: '2026-10-26' });
		await field().fill('11/15/2026');
		await expect.element(value()).toHaveTextContent('2026-11-15');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(value()).toHaveTextContent('2026-10-26');
		expect(input().value).toBe('10/26/2026');
	});

	it("keeps the app's own input and blur handlers", async () => {
		const oninput = vi.fn();
		const onblur = vi.fn();
		await render(DatePickerHarness, { oninput, onblur });
		await field().fill('10/26/2026');
		await leave();
		expect(oninput).toHaveBeenCalled();
		expect(onblur).toHaveBeenCalledOnce();
	});

	it('says how to write a date it cannot read', async () => {
		await render(DatePickerHarness, {});
		await field().fill('13/45/2026');
		await leave();
		await expect.element(field()).toHaveAccessibleDescription('Enter a date as mm/dd/yyyy');
		await expect.element(value()).toHaveTextContent('null');
	});

	it('says when a date is before min or ruled out', async () => {
		await render(DatePickerHarness, { min: '2026-10-01', weekends: true });
		await field().fill('09/30/2026');
		await leave();
		await expect.element(field()).toHaveAccessibleDescription('Enter 10/01/2026 or later');
		await field().fill('10/24/2026');
		await expect.element(field()).toHaveAccessibleDescription('This date cannot be chosen');
	});

	it('opens a calendar on the date, chooses with the keys and gives focus back to the field', async () => {
		await render(DatePickerHarness, { value: '2026-10-15' });
		await button().click();
		const grid = page.getByRole('grid', { name: 'October 2026' });
		await expect.element(grid).toBeVisible();
		await expect
			.poll(() => (document.activeElement as HTMLElement).dataset.date)
			.toBe('2026-10-15');
		await userEvent.keyboard('{ArrowRight}{Enter}');
		await expect.element(value()).toHaveTextContent('2026-10-16');
		expect(input().value).toBe('10/16/2026');
		await expect.element(grid).not.toBeInTheDocument();
		await expect.element(field()).toHaveFocus();
	});

	it('opens the calendar on a date outside min, focus on that day', async () => {
		await render(DatePickerHarness, { value: '2026-09-30', min: '2026-10-01' });
		await button().click();
		await expect.element(page.getByRole('grid', { name: 'September 2026' })).toBeVisible();
		await expect
			.poll(() => (document.activeElement as HTMLElement).dataset.date)
			.toBe('2026-09-30');
	});

	it('closes the calendar with Escape, focus back on its button', async () => {
		await render(DatePickerHarness, {});
		(button().element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByRole('grid')).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
		await expect.element(button()).toHaveFocus();
	});

	it('writes a date set from outside in the locale format, and empties to null', async () => {
		const { rerender } = await render(DatePickerHarness, { value: '2026-03-09' });
		expect(input().value).toBe('03/09/2026');
		await rerender({ value: '2027-12-31' });
		await expect.poll(() => input().value).toBe('12/31/2027');
		await field().fill('');
		await expect.element(value()).toHaveTextContent('null');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('null');
	});

	it('submits the ISO date with the form', async () => {
		await render(DatePickerHarness, { value: '2026-10-26' });
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('day=2026-10-26');
	});
});
