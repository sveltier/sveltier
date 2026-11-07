import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import OdometerHarness from '../../../tests/fixtures/OdometerHarness.svelte';

const root = () => page.getByTestId('odometer').element() as HTMLElement;
const columns = () => [...root().querySelectorAll<HTMLElement>('.sv-odometer__column')];
// The digit each window shows: the one whose row lies in the window.
const shownDigits = () =>
	columns()
		.map((column) => {
			const window = column.parentElement!.getBoundingClientRect();
			const row = [...column.children].find((digit) => {
				const box = digit.getBoundingClientRect();
				return Math.abs(box.top - window.top) < 1;
			});
			return row?.textContent ?? '?';
		})
		.join('');

describe('Odometer', () => {
	it('shows the figure formatted as an Amount, and reads it as text', async () => {
		await render(OdometerHarness);
		await expect.element(page.getByText('$1,234.50')).toBeInTheDocument();
		expect(root().querySelector('.sv-visually-hidden')!.textContent).toBe('$1,234.50');
		expect(root().querySelector('.sv-odometer__figure')!.getAttribute('aria-hidden')).toBe('true');
		await expect.poll(shownDigits).toBe('123450');
	});

	it('rolls each digit to the new value', async () => {
		const screen = await render(OdometerHarness);
		await screen.rerender({ value: 1299.75 });
		await expect.poll(shownDigits, { timeout: 3000 }).toBe('129975');
		const moved = getComputedStyle(columns()[2]!).transitionDuration;
		expect(Number.parseFloat(moved)).toBeGreaterThan(0);
	});

	it('keeps the digits by their place from the end when a digit is added at the front', async () => {
		const screen = await render(OdometerHarness, { value: 999, format: undefined, decimals: 0 });
		const units = columns().at(-1);
		await screen.rerender({ value: 1000, format: undefined, decimals: 0 });
		expect(columns().at(-1)).toBe(units);
		await expect.poll(shownDigits, { timeout: 3000 }).toBe('1000');
	});

	it('shows a dash with no value, and dots when masked', async () => {
		const screen = await render(OdometerHarness, { value: null });
		expect(root().textContent).toContain('—');
		await screen.rerender({ value: 10, defaults: { Amount: { masked: true } } });
		expect(root().textContent).toBe('••••Amount hidden');
	});
});
