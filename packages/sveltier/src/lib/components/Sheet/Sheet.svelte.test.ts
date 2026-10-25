import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SheetHarness from '../../../tests/fixtures/SheetHarness.svelte';

const trigger = () => page.getByRole('button', { name: 'Filters' });
const sheet = () => page.getByRole('dialog', { name: 'Filters' });
const panel = () => sheet().element().querySelector('.sv-modal__panel') as HTMLElement;
// The panel's box once its slide-in has finished.
async function settled() {
	await expect.element(sheet()).toBeVisible();
	await expect
		.poll(() => getComputedStyle(panel()).transform)
		.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
	return panel().getBoundingClientRect();
}

describe('Sheet', () => {
	it('opens from its trigger as a modal dialog against the end edge, full height', async () => {
		await render(SheetHarness, { size: 'xs' });
		await trigger().click();
		const box = await settled();
		expect((sheet().element() as HTMLDialogElement).matches(':modal')).toBe(true);
		expect(Math.round(box.right)).toBe(window.innerWidth);
		expect(Math.round(box.height)).toBe(window.innerHeight);
		expect(Math.round(box.width)).toBe(21 * 16);
	});

	it('takes the start and end edges from the writing direction', async () => {
		await render(SheetHarness, { side: 'start', dir: 'rtl' });
		await trigger().click();
		const box = await settled();
		expect(Math.round(box.right)).toBe(window.innerWidth);
	});

	it('sits on the bottom edge from below, as wide as its size at most', async () => {
		await render(SheetHarness, { side: 'bottom', size: 'xs' });
		await trigger().click();
		const box = await settled();
		expect(Math.round(box.bottom)).toBe(window.innerHeight);
		expect(Math.round(box.width)).toBeLessThanOrEqual(21 * 16);
		expect(box.height).toBeLessThan(window.innerHeight);
	});

	it('closes on Escape and on the backdrop, and gives focus back to its trigger', async () => {
		// Narrow enough to leave backdrop beside it in the test frame, which is 414px wide.
		await render(SheetHarness, { size: 'xs' });
		await trigger().click();
		await settled();
		await userEvent.keyboard('{Escape}');
		await expect.element(sheet()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('reason')).toHaveTextContent('escape');
		await expect.element(trigger()).toHaveFocus();
		await trigger().click();
		await settled();
		await userEvent.click(sheet(), { position: { x: 4, y: 4 } });
		await expect.element(sheet()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('reason')).toHaveTextContent('outside');
	});
});
