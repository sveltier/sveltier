import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ProgressHarness from '../../../tests/fixtures/ProgressHarness.svelte';

const linear = () => page.getByTestId('linear').element() as HTMLElement;
const circular = () => page.getByTestId('circular').element() as HTMLElement;
const bar = () => linear().querySelector<HTMLElement>('.sv-progress-linear__bar')!;

describe('Progress', () => {
	it('reports its value to assistive technology, clamped to 0–100', async () => {
		const screen = await render(ProgressHarness, { value: 40 });
		for (const element of [linear(), circular()]) {
			expect(element.getAttribute('role')).toBe('progressbar');
			expect(element.getAttribute('aria-valuenow')).toBe('40');
			expect(element.getAttribute('aria-valuemin')).toBe('0');
			expect(element.getAttribute('aria-valuemax')).toBe('100');
			expect(element.getAttribute('aria-label')).toBe('Progress');
		}
		await screen.rerender({ value: 140 });
		expect(linear().getAttribute('aria-valuenow')).toBe('100');
		await screen.rerender({ value: -5 });
		expect(circular().getAttribute('aria-valuenow')).toBe('0');
	});

	it('has no value and says it is loading when indeterminate', async () => {
		await render(ProgressHarness, { indeterminate: true });
		for (const element of [linear(), circular()]) {
			expect(element.hasAttribute('aria-valuenow')).toBe(false);
			expect(element.getAttribute('aria-label')).toBe('Loading');
		}
		expect(getComputedStyle(bar()).animationName).not.toBe('none');
	});

	it('takes a name of its own', async () => {
		await render(ProgressHarness, { value: 10, label: 'Uploading statement' });
		await expect
			.element(page.getByRole('progressbar', { name: 'Uploading statement' }).first())
			.toBeVisible();
	});

	it('fills the bar by scaling it from the start edge', async () => {
		const screen = await render(ProgressHarness, { value: 25 });
		await expect.poll(() => bar().getBoundingClientRect().width).toBeCloseTo(50, 0);
		const track = linear().getBoundingClientRect();
		expect(bar().getBoundingClientRect().left).toBeCloseTo(track.left, 0);
		await screen.rerender({ dir: 'rtl' });
		await expect.poll(() => bar().getBoundingClientRect().right).toBeCloseTo(track.right, 0);
	});

	it('draws the arc for the value, around a centred label', async () => {
		await render(ProgressHarness, { value: 50 });
		const arc = circular().querySelector('.sv-progress-circular__arc')!;
		const [dash, gap] = arc.getAttribute('stroke-dasharray')!.split(' ').map(Number);
		expect(dash! / gap!).toBeCloseTo(0.5, 5);
		expect(circular().textContent?.trim()).toBe('50%');
		expect(circular().getBoundingClientRect().width).toBeCloseTo(2.618 * 16, 1);
	});
});
