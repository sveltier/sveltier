import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import FiguresHarness from '../../../tests/fixtures/FiguresHarness.svelte';

const overlay = (testId: string) =>
	page.getByTestId(testId).element().querySelector('.sv-amount__flash') as HTMLElement;
const flashes = (testId: string) => overlay(testId).getAnimations().length;

describe('Amount flash', () => {
	it('does not flash on the first render', async () => {
		await render(FiguresHarness, {});
		expect(flashes('price')).toBe(0);
		expect(flashes('change')).toBe(0);
	});

	it('flashes the up colour on a rise and the down colour on a fall', async () => {
		const { rerender } = await render(FiguresHarness, {});
		await rerender({ price: 132.5 });
		await expect.poll(() => flashes('price')).toBe(1);
		expect(overlay('price').dataset.direction).toBe('up');
		const up = getComputedStyle(overlay('price')).backgroundColor;
		await rerender({ price: 130 });
		expect(overlay('price').dataset.direction).toBe('down');
		expect(getComputedStyle(overlay('price')).backgroundColor).not.toBe(up);
		// A new move restarts the flash rather than stacking a second one.
		expect(flashes('price')).toBe(1);
	});

	it('flashes a change as well', async () => {
		const { rerender } = await render(FiguresHarness, {});
		await rerender({ change: -1.5 });
		await expect.poll(() => flashes('change')).toBe(1);
		expect(overlay('change').dataset.direction).toBe('down');
	});

	it('does not flash while masked, which would give the direction away', async () => {
		const { rerender } = await render(FiguresHarness, { masked: true });
		await rerender({ masked: true, price: 140 });
		expect(flashes('price')).toBe(0);
	});
});
