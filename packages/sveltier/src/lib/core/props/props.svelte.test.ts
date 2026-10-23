import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SharedHarness from '../../../tests/fixtures/SharedHarness.svelte';
import { monolith, monolithLight } from '../../themes/monolith.js';
import { defineTheme } from '../theme/define.js';

const box = (id: 'outer' | 'inner') => page.getByTestId(id).element();
const style = (id: 'outer' | 'inner') => getComputedStyle(box(id));

/** How the current page paints `value` for `property`, for comparing serialised colours. */
function paint(property: 'background-color' | 'color', value: string): string {
	const probe = document.createElement('div');
	probe.style.setProperty(property, value);
	document.body.append(probe);
	const painted = getComputedStyle(probe).getPropertyValue(property);
	probe.remove();
	return painted;
}

const PX_PER_REM = 16;

describe('shared props', () => {
	it('flat fills with the colour and writes in its on-colour', async () => {
		await render(SharedHarness, { outer: { variant: 'flat', color: 'primary' } });
		expect(style('outer').backgroundColor).toBe(
			paint('background-color', 'var(--sv-color-primary)')
		);
		expect(style('outer').color).toBe(paint('color', 'var(--sv-on-primary)'));
		expect(style('outer').borderTopColor).toBe(paint('color', 'transparent'));
	});

	it('tonal washes the colour and mixes its text toward the theme text', async () => {
		await render(SharedHarness, { outer: { variant: 'tonal', color: 'success' } });
		expect(style('outer').backgroundColor).toBe(
			paint(
				'background-color',
				'color-mix(in oklch, var(--sv-color-success) var(--sv-tonal-wash), transparent)'
			)
		);
		expect(style('outer').color).toBe(
			paint(
				'color',
				'color-mix(in oklch, var(--sv-color-success) var(--sv-tonal-text-mix), var(--sv-color-text))'
			)
		);
	});

	it('outlined colours the text and the border; text and plain only the text', async () => {
		const screen = await render(SharedHarness, { outer: { variant: 'outlined', color: 'error' } });
		const error = paint('color', 'var(--sv-color-error)');
		expect(style('outer').color).toBe(error);
		expect(style('outer').borderTopColor).toBe(error);
		expect(style('outer').backgroundColor).toBe(paint('background-color', 'transparent'));

		for (const variant of ['text', 'plain'] as const) {
			await screen.rerender({ outer: { variant, color: 'error' } });
			expect(style('outer').color).toBe(error);
			expect(style('outer').borderTopColor).toBe(paint('color', 'transparent'));
		}
	});

	it('turns hover and press washes off for plain only', async () => {
		const screen = await render(SharedHarness, { outer: { variant: 'text', color: 'info' } });
		expect(style('outer').getPropertyValue('--sv-state-hover').trim()).toBe('8%');
		await screen.rerender({ outer: { variant: 'plain', color: 'info' } });
		expect(style('outer').getPropertyValue('--sv-state-hover').trim()).toBe('0%');
		expect(style('outer').getPropertyValue('--sv-state-press').trim()).toBe('0%');
	});

	it('maps neutral to the text colour, with the background as its on-colour', async () => {
		await render(SharedHarness, { outer: { variant: 'flat', color: 'neutral' } });
		expect(style('outer').backgroundColor).toBe(paint('background-color', 'var(--sv-color-text)'));
		expect(style('outer').color).toBe(paint('color', 'var(--sv-color-background)'));
	});

	it('sets height and text from the size, and lets density scale the height only', async () => {
		const screen = await render(SharedHarness, { outer: { size: 'md', density: 'default' } });
		expect(box('outer').getBoundingClientRect().height).toBeCloseTo(2.618 * PX_PER_REM, 1);
		expect(parseFloat(style('outer').fontSize)).toBeCloseTo(0.8867 * PX_PER_REM, 1);

		await screen.rerender({ outer: { size: 'lg', density: 'compact' } });
		expect(box('outer').getBoundingClientRect().height).toBeCloseTo(
			3.3302 * 0.8867 * PX_PER_REM,
			1
		);
		expect(parseFloat(style('outer').fontSize)).toBeCloseTo(PX_PER_REM, 1);

		await screen.rerender({ outer: { size: 'xs', density: 'comfortable' } });
		expect(box('outer').getBoundingClientRect().height).toBeCloseTo(1.618 * 1.1278 * PX_PER_REM, 1);
	});

	it('picks theme radii, a pill for full, square for none', async () => {
		const screen = await render(SharedHarness, { outer: { rounded: 'lg' } });
		expect(style('outer').borderTopLeftRadius).toBe('13px');
		await screen.rerender({ outer: { rounded: 'full' } });
		expect(style('outer').borderTopLeftRadius).toBe('9999px');
		await screen.rerender({ outer: { rounded: false } });
		expect(style('outer').borderTopLeftRadius).toBe('0px');
	});

	it('gives a nested component its own values instead of its parent’s', async () => {
		await render(SharedHarness, {
			outer: { variant: 'flat', color: 'error', size: 'xl', density: 'compact', rounded: 'full' },
			inner: { variant: 'text', color: 'success', size: 'sm', density: 'default', rounded: true }
		});
		expect(style('inner').color).toBe(paint('color', 'var(--sv-color-success)'));
		expect(style('inner').backgroundColor).toBe(paint('background-color', 'transparent'));
		expect(box('inner').getBoundingClientRect().height).toBeCloseTo(2.0582 * PX_PER_REM, 1);
		// rounded: true clears the inherited pill, so the component's own default (3px) applies.
		expect(style('inner').borderTopLeftRadius).toBe('3px');
	});

	it('supports custom colours from defineTheme through the theme stylesheet', async () => {
		const brand = defineTheme({ colors: { brand: 'oklch(0.55 0.15 300)' } }, monolithLight);
		await render(SharedHarness, {
			themes: { ...monolith, brand },
			theme: 'brand',
			outer: { variant: 'flat', color: 'brand' }
		});
		expect(style('outer').backgroundColor).toBe(paint('background-color', 'oklch(0.55 0.15 300)'));
		expect(style('outer').color).toBe(paint('color', 'var(--sv-on-brand)'));
		expect(style('outer').color).not.toBe(paint('color', 'transparent'));
	});
});
