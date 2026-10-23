import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import KeyboardHarness from '../../../tests/fixtures/KeyboardHarness.svelte';

const log = () => page.getByTestId('log');
const fruit = (name: string) => page.getByRole('option', { name });
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function press(element: Element, init: KeyboardEventInit): KeyboardEvent {
	const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
	element.dispatchEvent(event);
	return event;
}

describe('keymap', () => {
	it('calls the handler of a key and prevents its default', async () => {
		await render(KeyboardHarness);
		const slider = page.getByTestId('slider').element();
		expect(press(slider, { key: 'ArrowRight' }).defaultPrevented).toBe(true);
		expect(press(slider, { key: 'ArrowLeft' }).defaultPrevented).toBe(true);
		expect(press(slider, { key: 'ArrowUp' }).defaultPrevented).toBe(true);
		await expect.element(log()).toHaveTextContent('forward,backward,up');
	});

	it('matches modifiers, ignores Shift for characters, and passes on unhandled keys', async () => {
		await render(KeyboardHarness);
		const slider = page.getByTestId('slider').element();
		press(slider, { key: 'k', ctrlKey: true });
		press(slider, { key: 'k' });
		press(slider, { key: '?', shiftKey: true });
		expect(press(slider, { key: 'Enter' }).defaultPrevented).toBe(false);
		expect(press(slider, { key: 'ArrowRight', ctrlKey: true }).defaultPrevented).toBe(false);
		await expect.element(log()).toHaveTextContent('ctrl-k,help');
	});

	it('swaps forward and backward in right-to-left text', async () => {
		await render(KeyboardHarness, { dir: 'rtl' });
		press(page.getByTestId('slider').element(), { key: 'ArrowRight' });
		await expect.element(log()).toHaveTextContent('backward');
	});
});

describe('typeahead', () => {
	it('moves to the item that starts with what was typed', async () => {
		await render(KeyboardHarness);
		fruit('Apple').element().focus();
		await userEvent.keyboard('b');
		await expect.element(fruit('Banana')).toHaveFocus();
		await userEvent.keyboard('l');
		await expect.element(fruit('Blueberry')).toHaveFocus();
	});

	it('cycles through the items with a repeated character', async () => {
		await render(KeyboardHarness);
		fruit('Date').element().focus();
		await userEvent.keyboard('a');
		await expect.element(fruit('Apple')).toHaveFocus();
		await userEvent.keyboard('a');
		await expect.element(fruit('Avocado')).toHaveFocus();
		await userEvent.keyboard('a');
		await expect.element(fruit('Apple')).toHaveFocus();
	});

	it('starts a new search after the timeout, and skips disabled items', async () => {
		await render(KeyboardHarness, { timeout: 100 });
		fruit('Apple').element().focus();
		await userEvent.keyboard('b');
		await wait(150);
		await userEvent.keyboard('d');
		await expect.element(fruit('Date')).toHaveFocus();
		await wait(150);
		await userEvent.keyboard('c');
		await expect.element(fruit('Date')).toHaveFocus();
	});

	it('moves the roving tab stop with focus', async () => {
		await render(KeyboardHarness);
		fruit('Apple').element().focus();
		await userEvent.keyboard('d');
		await expect.element(fruit('Date')).toHaveAttribute('tabindex', '0');
		await expect.element(fruit('Apple')).toHaveAttribute('tabindex', '-1');
	});
});
