import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import RadiusHarness from './fixtures/RadiusHarness.svelte';

const radius = (element: Element) => getComputedStyle(element).borderStartStartRadius;
const box = (label: string) => page.getByLabelText(label).element().closest('.sv-field__box')!;

// A theme may make its controls pills. Boxes that grow with their content take the control
// radius only up to the card radius, so they never turn into ovals.
describe('radius of boxes that grow with their content', () => {
	it('stops at the card radius in a theme with pill controls', async () => {
		await render(RadiusHarness, { theme: 'milano-light' });

		expect(radius(box('Note'))).toBe('13px');
		expect(radius(page.getByTestId('alert').element())).toBe('13px');
		expect(radius(page.getByTestId('skeleton').element())).toBe('13px');
		expect(radius(box('Name'))).toBe('999px');
		expect(radius(page.getByRole('button', { name: 'Save' }).element())).toBe('999px');
	});

	it('follows the control radius when it is the smaller one', async () => {
		await render(RadiusHarness, { theme: 'monolith-light' });

		expect(radius(box('Note'))).toBe('8px');
		expect(radius(page.getByTestId('alert').element())).toBe('8px');
		expect(radius(page.getByTestId('skeleton').element())).toBe('8px');
		expect(radius(box('Name'))).toBe('8px');
	});

	it('still gives way to the rounded prop', async () => {
		await render(RadiusHarness, { theme: 'milano-light', rounded: 'none' });

		expect(radius(box('Note'))).toBe('0px');
		expect(radius(page.getByTestId('alert').element())).toBe('0px');
	});
});
