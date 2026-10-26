import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DateRangePickerHarness from '../../../tests/fixtures/DateRangePickerHarness.svelte';

const startField = () => page.getByRole('textbox', { name: 'Holding period Start' });
const endField = () => page.getByRole('textbox', { name: 'Holding period End' });
const bound = (which: 'start' | 'end') => page.getByTestId(which);
const focused = () => (document.activeElement as HTMLElement | null)?.dataset.date;

describe('DateRangePicker', () => {
	it('names its two dates after the label, and reads each as typed', async () => {
		await render(DateRangePickerHarness, {});
		await startField().fill('10/01/2026');
		await endField().fill('10/26/2026');
		await expect.element(bound('start')).toHaveTextContent('2026-10-01');
		await expect.element(bound('end')).toHaveTextContent('2026-10-26');
		await expect
			.poll(() => page.getByTestId('changes').element().textContent)
			.toContain('2026-10-01→2026-10-26');
	});

	it('does not leave the field going from the start to the end', async () => {
		await render(DateRangePickerHarness, { required: true });
		await startField().fill('10/01/2026');
		await userEvent.keyboard('{Tab}');
		await expect.element(endField()).toHaveFocus();
		expect(document.querySelector('.sv-field__error')).toBeNull();
		// Going on to the calendar button is leaving the dates: the end is missing.
		await userEvent.keyboard('{Tab}');
		await expect.element(endField()).toHaveAccessibleDescription('Required');
	});

	it("names its dates after the app's aria-labelledby when it has no label", async () => {
		await render(DateRangePickerHarness, { label: undefined, 'aria-labelledby': 'period' });
		const inputs = document.querySelectorAll<HTMLInputElement>('input[type="text"]');
		expect(inputs[0]!.getAttribute('aria-labelledby')).toMatch(/^period \S+-start$/);
		expect(inputs[1]!.getAttribute('aria-labelledby')).toMatch(/^period \S+-end$/);
	});

	it('goes back to the dates it started with when its form is reset', async () => {
		await render(DateRangePickerHarness, { start: '2026-10-01', end: '2026-10-26' });
		await startField().fill('11/02/2026');
		await endField().fill('11/30/2026');
		await expect.element(bound('end')).toHaveTextContent('2026-11-30');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(bound('start')).toHaveTextContent('2026-10-01');
		await expect.element(bound('end')).toHaveTextContent('2026-10-26');
		expect(endField().element()).toHaveProperty('value', '10/26/2026');
	});

	it('says when the end comes before the start', async () => {
		await render(DateRangePickerHarness, {});
		await startField().fill('10/26/2026');
		await endField().fill('10/01/2026');
		await userEvent.keyboard('{Tab}');
		await expect.element(startField()).toHaveAccessibleDescription('End on or after the start');
	});

	it('chooses a start, then an end, in the calendar, and gives focus to the end', async () => {
		await render(DateRangePickerHarness, { start: '2026-10-05' });
		await page.getByRole('button', { name: 'Choose dates' }).click();
		await expect.poll(focused).toBe('2026-10-05');
		// The range is whole only with an end: the first day chosen starts it again.
		await userEvent.keyboard('{ArrowRight}{Enter}');
		await expect.element(bound('start')).toHaveTextContent('2026-10-05');
		await expect.element(bound('end')).toHaveTextContent('2026-10-06');
		await expect.element(endField()).toHaveFocus();
		// Reopened once the last calendar has gone, as a person would.
		await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
		await page.getByRole('button', { name: 'Choose dates' }).click();
		await expect.poll(focused).toBe('2026-10-05');
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.element(bound('start')).toHaveTextContent('2026-10-12');
		await expect.element(bound('end')).toHaveTextContent('null');
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		expect(document.querySelectorAll('.sv-calendar__cell--within')).toHaveLength(3);
		await userEvent.keyboard('{Enter}');
		await expect.element(bound('end')).toHaveTextContent('2026-10-14');
		expect(startField().element()).toHaveProperty('value', '10/12/2026');
		expect(endField().element()).toHaveProperty('value', '10/14/2026');
	});

	it('selects every day of the range, in a grid that allows several', async () => {
		await render(DateRangePickerHarness, { start: '2026-10-05', end: '2026-10-08' });
		await page.getByRole('button', { name: 'Choose dates' }).click();
		const grid = page.getByRole('grid');
		await expect.element(grid).toHaveAttribute('aria-multiselectable', 'true');
		const selected = [...grid.element().querySelectorAll('[aria-selected="true"] button')];
		expect(selected.map((day) => day.getAttribute('data-date'))).toEqual([
			'2026-10-05',
			'2026-10-06',
			'2026-10-07',
			'2026-10-08'
		]);
	});

	it('starts again from a day before the start', async () => {
		await render(DateRangePickerHarness, { start: '2026-10-20' });
		await page.getByRole('button', { name: 'Choose dates' }).click();
		await expect.poll(focused).toBe('2026-10-20');
		await userEvent.keyboard('{ArrowUp}{Enter}');
		await expect.element(bound('start')).toHaveTextContent('2026-10-13');
		await expect.element(page.getByRole('grid')).toBeVisible();
	});

	it('submits the start and then the end under one name', async () => {
		await render(DateRangePickerHarness, { start: '2026-10-01', end: '2026-10-26' });
		await page.getByRole('button', { name: 'Send' }).click();
		await expect
			.element(page.getByTestId('submitted'))
			.toHaveTextContent('period=2026-10-01&period=2026-10-26');
	});
});
