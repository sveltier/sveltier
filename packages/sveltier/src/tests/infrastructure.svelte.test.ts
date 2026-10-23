import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import LayeredBox from './fixtures/LayeredBox.svelte';

// Guards the assumptions every component relies on: real browser DOM, component CSS
// imported from the .svelte file, cascade layers, and keyboard focus.

const twoButtons = createRawSnippet(() => ({
	render: () =>
		'<span><button type="button">First</button><button type="button">Second</button></span>'
}));

describe('test infrastructure', () => {
	it('applies the stylesheet imported by the component', async () => {
		const screen = await render(LayeredBox, { children: twoButtons });
		const box = screen.container.querySelector('.sv-layered-box');

		expect(box).not.toBeNull();
		expect(getComputedStyle(box as Element).paddingBlockStart).toBe('3px');
	});

	it('lets unlayered author CSS override component CSS without !important', async () => {
		const override = document.createElement('style');
		override.textContent = '.sv-layered-box { padding-block: 9px; }';
		document.head.append(override);
		try {
			const screen = await render(LayeredBox, { children: twoButtons });
			const box = screen.container.querySelector('.sv-layered-box');
			expect(getComputedStyle(box as Element).paddingBlockStart).toBe('9px');
		} finally {
			override.remove();
		}
	});

	// userEvent.tab() presses Tab without first focusing the test iframe, which is flaky in
	// Firefox; userEvent.keyboard() focuses the iframe first.
	it('moves focus with the keyboard and matches :focus-visible', async () => {
		await render(LayeredBox, { children: twoButtons });
		const first = page.getByRole('button', { name: 'First' });
		const second = page.getByRole('button', { name: 'Second' });

		await userEvent.keyboard('{Tab}');
		await expect.element(first).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(second).toHaveFocus();
		expect((second.element() as HTMLElement).matches(':focus-visible')).toBe(true);
	});
});
