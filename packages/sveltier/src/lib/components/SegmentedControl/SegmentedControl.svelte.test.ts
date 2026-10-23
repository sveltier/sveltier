import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SegmentedHarness from '../../../tests/fixtures/SegmentedHarness.svelte';

const group = () => page.getByRole('radiogroup', { name: 'Chart range' });
const option = (name: string) => group().getByRole('radio', { name, exact: true });
const text = (id: string) => page.getByTestId(id).element().textContent;
const thumb = () => page.getByTestId('control').element().querySelector('.sv-segmented__thumb')!;

describe('SegmentedControl', () => {
	it('is a radio group with one tab stop, on the checked option', async () => {
		await render(SegmentedHarness, {});
		await expect.element(option('1M')).toHaveAttribute('aria-checked', 'true');
		expect(group().element().querySelectorAll('[tabindex="0"]')).toHaveLength(1);
		expect((option('1M').element() as HTMLElement).tabIndex).toBe(0);
	});

	it('picks an option on click, and reports it', async () => {
		await render(SegmentedHarness, {});
		await option('1W').click();
		await expect.element(option('1W')).toHaveAttribute('aria-checked', 'true');
		expect(text('value')).toBe('1W');
		expect(text('changed')).toBe('1W');
	});

	it('moves and picks with the arrow keys, skipping disabled options', async () => {
		await render(SegmentedHarness, { disabledYear: true });
		(option('1M').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(text('value')).toBe('All');
		await userEvent.keyboard('{Home}');
		expect(text('value')).toBe('1D');
		await userEvent.keyboard('{ArrowLeft}');
		expect(text('value')).toBe('All');
	});

	it('follows the writing direction with the arrows', async () => {
		await render(SegmentedHarness, { dir: 'rtl' });
		(option('1M').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(text('value')).toBe('1Y');
	});

	it('slides the thumb under the checked option, in either direction', async () => {
		const screen = await render(SegmentedHarness, {});
		const aligned = () => {
			const a = thumb().getBoundingClientRect();
			const b = option(text('value')!).element().getBoundingClientRect();
			return Math.abs(a.left - b.left) < 1 && Math.abs(a.width - b.width) < 1;
		};
		await expect.poll(aligned).toBe(true);
		await option('1D').click();
		await expect.poll(aligned).toBe(true);
		await screen.rerender({ dir: 'rtl' });
		await expect.poll(aligned).toBe(true);
	});
});
