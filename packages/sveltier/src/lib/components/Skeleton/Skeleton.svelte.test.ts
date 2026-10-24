import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SkeletonHarness from '../../../tests/fixtures/SkeletonHarness.svelte';

const skeleton = () => page.getByTestId('skeleton').element() as HTMLElement;
const box = (element: Element) => element.getBoundingClientRect();

describe('Skeleton', () => {
	it('draws lines of text, the last φ⁻¹ as wide, hidden from assistive technology', async () => {
		await render(SkeletonHarness, { lines: 3 });
		expect(skeleton().getAttribute('aria-hidden')).toBe('true');
		const lines = skeleton().querySelectorAll('.sv-skeleton__line');
		expect(lines).toHaveLength(3);
		expect(box(lines[0]!).height).toBeCloseTo(20, 0);
		expect(box(lines[0]!).width).toBeCloseTo(300, 0);
		expect(box(lines[2]!).width).toBeCloseTo(300 * 0.618, 0);
	});

	it('is a golden rectangle across its container', async () => {
		await render(SkeletonHarness, { type: 'rect' });
		expect(box(skeleton()).width).toBeCloseTo(300, 0);
		expect(box(skeleton()).height).toBeCloseTo(300 / 1.618, 0);
	});

	it('is a circle as wide as a control of its size', async () => {
		await render(SkeletonHarness, { type: 'circle', size: 'lg' });
		expect(box(skeleton()).width).toBeCloseTo(3.3302 * 16, 1);
		expect(box(skeleton()).height).toBeCloseTo(box(skeleton()).width, 1);
		expect(getComputedStyle(skeleton()).borderTopLeftRadius).toBe('50%');
	});

	it('sweeps a highlight across while it waits', async () => {
		await render(SkeletonHarness, { type: 'rect' });
		expect(getComputedStyle(skeleton(), '::after').animationName).toBe('sv-skeleton-sweep');
	});
});
