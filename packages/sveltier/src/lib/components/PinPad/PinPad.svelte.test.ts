import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PinPadHarness from '../../../tests/fixtures/PinPadHarness.svelte';

const pad = () => page.getByRole('group', { name: 'Enter your trading PIN' });
const key = (name: string) => page.getByRole('button', { name, exact: true });
const shown = (testId: string) => page.getByTestId(testId);
const filled = () => document.querySelectorAll('.sv-pin-pad__dot--filled').length;
const digitsInOrder = () =>
	[...document.querySelectorAll('.sv-pin-pad__key:not(.sv-pin-pad__key--delete)')].map(
		(key) => key.textContent
	);

describe('PinPad', () => {
	it('is a group named by its label, with keys 1 to 9, 0 and Delete in the phone layout', async () => {
		await render(PinPadHarness);
		await expect.element(pad()).toBeVisible();
		expect(digitsInOrder()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
		await expect.element(key('Delete')).toBeDisabled();
		expect(document.querySelectorAll('.sv-pin-pad__dot')).toHaveLength(4);
	});

	it('fills a dot per key pressed and calls oncomplete with the PIN', async () => {
		await render(PinPadHarness);
		await key('1').click();
		await key('9').click();
		expect(filled()).toBe(2);
		await key('0').click();
		await key('7').click();
		await expect.element(shown('completed')).toHaveTextContent('1907');
		await key('5').click();
		expect(shown('value').element().textContent).toBe('1907');
	});

	it('deletes the last digit', async () => {
		await render(PinPadHarness, { value: '12' });
		await key('Delete').click();
		await expect.element(shown('value')).toHaveTextContent('1');
		expect(filled()).toBe(1);
	});

	it('never shows or announces a digit, only how many are in', async () => {
		await render(PinPadHarness);
		await key('8').click();
		await key('3').click();
		const pad = document.querySelector('.sv-pin-pad')!;
		const live = pad.querySelector('[aria-live="polite"]')!;
		expect(live.textContent?.trim()).toBe('2 of 4 digits entered');
		const text = [...pad.childNodes]
			.filter(
				(node) => !(node instanceof HTMLElement && node.classList.contains('sv-pin-pad__keys'))
			)
			.map((node) => node.textContent)
			.join('');
		expect(text).not.toMatch(/8|3(?! of)/);
	});

	it('takes digits and Backspace from the keyboard while focus is in the pad', async () => {
		await render(PinPadHarness);
		await key('1').click();
		await userEvent.keyboard('4');
		await userEvent.keyboard('2');
		await expect.element(shown('value')).toHaveTextContent('142');
		await userEvent.keyboard('{Backspace}');
		await expect.element(shown('value')).toHaveTextContent('14');
		await userEvent.keyboard('a');
		expect(shown('value').element().textContent).toBe('14');
	});

	it('submits the PIN with its form under its name', async () => {
		await render(PinPadHarness, { value: '2468' });
		await page.getByRole('button', { name: 'Confirm' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('pin=2468');
	});

	it('shows an error under the dots, which describes the pad', async () => {
		await render(PinPadHarness, { error: 'Wrong PIN, 2 tries left' });
		await expect.element(pad()).toHaveAccessibleDescription('Wrong PIN, 2 tries left');
		expect(document.querySelector('.sv-pin-pad__dots--shake')).not.toBeNull();
	});

	it('ignores the keys when disabled', async () => {
		await render(PinPadHarness, { disabled: true });
		await expect.element(key('5')).toBeDisabled();
	});

	it('puts the digits in a random order when shuffled', async () => {
		await render(PinPadHarness, { shuffle: true });
		await expect
			.poll(() => [...digitsInOrder()].sort())
			.toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
		// The same ten digits; ten shuffles all in the phone order would be one chance in 3.6
		// million each, so one in order is a fluke worth a look rather than a pass.
		expect(digitsInOrder()).not.toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
	});

	it('puts the extra snippet at the bottom left, beside 0', async () => {
		await render(PinPadHarness, { withExtra: true });
		const extra = page.getByRole('button', { name: 'Use fingerprint' }).element();
		const zero = key('0').element();
		expect(extra.getBoundingClientRect().right).toBeLessThan(zero.getBoundingClientRect().left);
	});
});
