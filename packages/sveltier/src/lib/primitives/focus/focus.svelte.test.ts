import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import RovingHarness from '../../../tests/fixtures/RovingHarness.svelte';
import TabbableCases from '../../../tests/fixtures/TabbableCases.svelte';
import TrapHarness from '../../../tests/fixtures/TrapHarness.svelte';
import { tabbable } from './tabbable.js';

const tab = () => userEvent.keyboard('{Tab}');
const shiftTab = () => userEvent.keyboard('{Shift>}{Tab}{/Shift}');
const button = (name: string) => page.getByRole('button', { name, exact: true });
const name = (element: Element) =>
	element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '';

describe('tabbable', () => {
	it('lists what Tab reaches, in the order Tab reaches it', async () => {
		await render(TabbableCases);
		const found = tabbable(page.getByTestId('cases').element()).map(name);
		expect(found).toEqual([
			'first by tabindex',
			'second by tabindex',
			'visible',
			'closed summary',
			'open summary',
			'in open details',
			'link',
			'focusable div',
			'text field',
			'radio a2',
			'radio b1',
			'editable'
		]);
	});
});

describe('focusTrap', () => {
	it('moves focus inside and wraps Tab and Shift+Tab at the edges', async () => {
		await render(TrapHarness, { open: true });
		await expect.element(button('One')).toHaveFocus();
		await tab();
		await expect.element(button('Two')).toHaveFocus();
		await tab();
		await tab();
		await expect.element(button('One')).toHaveFocus();
		await shiftTab();
		await expect.element(page.getByRole('textbox', { name: 'Three' })).toHaveFocus();
	});

	it('starts at initialFocus', async () => {
		await render(TrapHarness, { open: true, trap: { initialFocus: 'input' } });
		await expect.element(page.getByRole('textbox', { name: 'Three' })).toHaveFocus();
	});

	it('focuses the container when nothing inside can take focus', async () => {
		await render(TrapHarness, { open: true, empty: true });
		await expect.element(page.getByTestId('outer')).toHaveFocus();
		await tab();
		await expect.element(page.getByTestId('outer')).toHaveFocus();
	});

	it('brings focus back to where it was inside when it leaves', async () => {
		await render(TrapHarness, { open: true });
		await tab();
		button('Before').element().focus();
		await expect.element(button('Two')).toHaveFocus();
	});

	it('returns focus to where it was when the trap ends', async () => {
		const screen = await render(TrapHarness, { open: false });
		button('Before').element().focus();
		await screen.rerender({ open: true });
		await expect.element(button('One')).toHaveFocus();
		await screen.rerender({ open: false });
		await expect.element(button('Before')).toHaveFocus();
	});

	it('leaves focus alone with returnFocus: false', async () => {
		const screen = await render(TrapHarness, { open: false, trap: { returnFocus: false } });
		button('Before').element().focus();
		await screen.rerender({ open: true, trap: { returnFocus: false } });
		await expect.element(button('One')).toHaveFocus();
		await screen.rerender({ open: false, trap: { returnFocus: false } });
		await expect.element(button('Before')).not.toHaveFocus();
	});

	it('pauses for a nested trap and resumes when it ends', async () => {
		const screen = await render(TrapHarness, { open: true, inner: true });
		await expect.element(button('Inner A')).toHaveFocus();
		await tab();
		await tab();
		await expect.element(button('Inner A')).toHaveFocus();

		await screen.rerender({ open: true, inner: false });
		await expect.element(button('One')).toHaveFocus();
		await shiftTab();
		await expect.element(page.getByRole('textbox', { name: 'Three' })).toHaveFocus();
	});
});

describe('rovingFocus', () => {
	const item = (index: number) => button(`Item ${index}`);
	const stops = () => page.getByRole('toolbar').element().querySelectorAll('[tabindex="0"]').length;

	it('gives the group one tab stop', async () => {
		await render(RovingHarness);
		button('Before').element().focus();
		await tab();
		await expect.element(item(0)).toHaveFocus();
		await tab();
		await expect.element(button('After')).toHaveFocus();
		expect(stops()).toBe(1);
	});

	it('moves with the arrow keys, Home and End, and wraps', async () => {
		await render(RovingHarness);
		item(0).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(item(1)).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		await expect.element(item(3)).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect.element(item(0)).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(item(3)).toHaveFocus();
		expect(stops()).toBe(1);
	});

	it('stops at the ends without loop', async () => {
		await render(RovingHarness, { roving: { loop: false } });
		item(3).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(item(3)).toHaveFocus();
	});

	it('only uses the arrows of its orientation', async () => {
		await render(RovingHarness, { roving: { orientation: 'vertical' } });
		item(0).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(item(0)).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item(1)).toHaveFocus();
	});

	it('skips disabled items', async () => {
		await render(RovingHarness, { disabledIndex: 1 });
		item(0).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(item(2)).toHaveFocus();
	});

	it('starts at the current item and follows focus by pointer', async () => {
		await render(RovingHarness, { currentIndex: 2 });
		button('Before').element().focus();
		await tab();
		await expect.element(item(2)).toHaveFocus();
		await userEvent.click(item(3));
		await expect.element(item(3)).toHaveAttribute('tabindex', '0');
		expect(stops()).toBe(1);
	});

	it('follows the writing direction', async () => {
		await render(RovingHarness, { dir: 'rtl' });
		item(0).element().focus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(item(1)).toHaveFocus();
	});

	it('keeps one tab stop when items go away', async () => {
		const screen = await render(RovingHarness);
		item(3).element().focus();
		await screen.rerender({ count: 2 });
		await expect.element(item(0)).toHaveAttribute('tabindex', '0');
		expect(stops()).toBe(1);
	});
});
