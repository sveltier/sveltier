import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import MotionHarness from '../../../tests/fixtures/MotionHarness.svelte';
import { monolithLight } from '../../themes/monolith.js';
import { motion, pop, rise, spring } from './motion.js';

const scope = () => page.getByTestId('scope').element() as HTMLElement;

describe('motion', () => {
	it('reads the timing of the theme in scope', async () => {
		await render(MotionHarness);
		expect(motion(scope())).toEqual({
			fast: 144,
			normal: 233,
			slow: 377,
			ease: monolithLight.variables.ease
		});
	});

	it('follows reduced motion through the tokens', async () => {
		await render(MotionHarness);
		scope().style.setProperty('--sv-duration-normal', '0.01ms');
		expect(motion(scope()).normal).toBeCloseTo(0.01, 5);
		expect(rise(scope()).duration).toBeCloseTo(0.01, 5);
	});

	it('builds transitions that move only opacity and transform', async () => {
		await render(MotionHarness);
		const config = rise(scope());
		expect(config.duration).toBe(233);
		expect(config.css?.(0, 1)).toBe('opacity: 0; transform: translateY(8px)');
		expect(config.css?.(1, 0)).toBe('opacity: 1; transform: translateY(0px)');
		expect(pop(scope(), { scale: 0.9 }).css?.(0, 1)).toBe('opacity: 0; transform: scale(0.9)');
	});

	it('runs as a Svelte transition in and out', async () => {
		const screen = await render(MotionHarness, { shown: true });
		await expect.element(page.getByTestId('card')).toBeVisible();
		await screen.rerender({ shown: false });
		await expect.element(page.getByTestId('card')).not.toBeInTheDocument();
	});
});

describe('spring', () => {
	it('moves toward its target over time', async () => {
		const value = spring(0, 'snappy');
		value.target = 100;
		expect(value.current).toBeLessThan(100);
		await expect.poll(() => value.current, { timeout: 3000 }).toBeCloseTo(100, 0);
	});
});
