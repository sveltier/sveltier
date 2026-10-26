import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CalendarHarness from '../../../tests/fixtures/CalendarHarness.svelte';

const grid = () => page.getByRole('grid');
const day = (name: string) => page.getByRole('button', { name });
const focused = () => (document.activeElement as HTMLElement | null)?.dataset.date;
const value = () => page.getByTestId('value');
const title = () => document.querySelector('.sv-calendar__title')?.textContent;
const press = async (keys: string) => {
	(grid().element().querySelector('[tabindex="0"]') as HTMLElement).focus();
	await userEvent.keyboard(keys);
};

describe('Calendar', () => {
	it('shows the month of the chosen day, named, with one tab stop on that day', async () => {
		await render(CalendarHarness, { 'aria-label': 'Report day' });
		await expect.element(page.getByRole('group', { name: 'Report day' })).toBeVisible();
		expect(title()).toBe('October 2026');
		await expect.element(grid()).toHaveAccessibleName('October 2026');
		const stops = grid().element().querySelectorAll('[tabindex="0"]');
		expect(stops).toHaveLength(1);
		expect((stops[0] as HTMLElement).dataset.date).toBe('2026-10-15');
		await expect
			.element(day('Thursday, October 15, 2026'))
			.toHaveAttribute('data-date', '2026-10-15');
		expect(
			grid().element().querySelector('[aria-selected="true"] button')?.textContent?.trim()
		).toBe('15');
	});

	it('starts the week on the locale day, or the one asked for', async () => {
		await render(CalendarHarness, {});
		const first = () => grid().element().querySelector('th')?.getAttribute('abbr');
		expect(first()).toBe('Sunday');
		await render(CalendarHarness, { firstDayOfWeek: 1 });
		expect(
			page.getByRole('grid').all().at(-1)!.element().querySelector('th')?.getAttribute('abbr')
		).toBe('Monday');
	});

	it('moves by day, week, week end, month and year, across months', async () => {
		await render(CalendarHarness, {});
		await press('{ArrowRight}');
		expect(focused()).toBe('2026-10-16');
		await userEvent.keyboard('{ArrowDown}');
		expect(focused()).toBe('2026-10-23');
		await userEvent.keyboard('{Home}');
		expect(focused()).toBe('2026-10-18');
		await userEvent.keyboard('{End}');
		expect(focused()).toBe('2026-10-24');
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		expect(focused()).toBe('2026-11-07');
		expect(title()).toBe('November 2026');
		await userEvent.keyboard('{PageUp}');
		expect(focused()).toBe('2026-10-07');
		await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
		expect(focused()).toBe('2027-10-07');
	});

	it('leaves Alt, Control and Command with the arrows and page keys to the browser', async () => {
		await render(CalendarHarness, {});
		await press('{Alt>}{ArrowRight}{/Alt}');
		await userEvent.keyboard('{Control>}{PageDown}{/Control}');
		await userEvent.keyboard('{Meta>}{ArrowDown}{/Meta}');
		expect(grid().element().querySelector('[tabindex="0"]')?.getAttribute('data-date')).toBe(
			'2026-10-15'
		);
	});

	it('moves the tab stop to a day that gets focus, also one that cannot be chosen', async () => {
		await render(CalendarHarness, { weekends: true });
		// A click focuses the day in Chromium and Firefox.
		(day('Saturday, October 24, 2026').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(focused()).toBe('2026-10-25');
	});

	it('chooses with Enter or a click', async () => {
		await render(CalendarHarness, {});
		await press('{ArrowRight}{Enter}');
		await expect.element(value()).toHaveTextContent('2026-10-16');
		await day('Wednesday, October 28, 2026').click();
		await expect.element(value()).toHaveTextContent('2026-10-28');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('2026-10-16, 2026-10-28');
	});

	it('steps the month with its buttons, keeping focus on them', async () => {
		await render(CalendarHarness, {});
		// From the keyboard: a click does not focus a button in Safari.
		const next = page.getByRole('button', { name: 'Next month' });
		(next.element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		expect(title()).toBe('November 2026');
		await expect.element(next).toHaveFocus();
		await page.getByRole('button', { name: 'Previous month' }).click();
		await page.getByRole('button', { name: 'Previous month' }).click();
		expect(title()).toBe('September 2026');
	});

	it('reaches a ruled-out day but does not choose it', async () => {
		await render(CalendarHarness, { weekends: true });
		await press('{ArrowRight}{ArrowRight}');
		expect(focused()).toBe('2026-10-17');
		await expect
			.element(day('Saturday, October 17, 2026'))
			.toHaveAttribute('aria-disabled', 'true');
		await userEvent.keyboard('{Enter}');
		await expect.element(value()).toHaveTextContent('2026-10-15');
	});

	it('keeps days before min and after max from being chosen', async () => {
		await render(CalendarHarness, { min: '2026-10-10', max: '2026-10-20' });
		await day('Friday, October 9, 2026').click({ force: true });
		await day('Wednesday, October 21, 2026').click({ force: true });
		await expect.element(value()).toHaveTextContent('2026-10-15');
	});

	it('marks today', async () => {
		const now = new Date();
		const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
		await render(CalendarHarness, { value: iso });
		expect(grid().element().querySelector('[aria-current="date"]')?.getAttribute('data-date')).toBe(
			iso
		);
	});

	it('shows the month of a day chosen from outside, and puts the tab stop on it', async () => {
		const { rerender } = await render(CalendarHarness, {});
		await rerender({ value: '2026-10-20' });
		await expect
			.poll(() => grid().element().querySelector('[tabindex="0"]')?.getAttribute('data-date'))
			.toBe('2026-10-20');
		await rerender({ value: '2027-03-02' });
		await expect.poll(title).toBe('March 2027');
	});
});
