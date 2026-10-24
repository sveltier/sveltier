import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ChipHarness from '../../../tests/fixtures/ChipHarness.svelte';

const chip = () => page.getByTestId('chip').element() as HTMLElement;
const state = () => page.getByTestId('state').element().textContent;

describe('Chip', () => {
	it('is a static tonal pill by default', async () => {
		await render(ChipHarness, {});
		expect(chip().tagName).toBe('SPAN');
		expect(chip().tabIndex).toBe(-1);
		expect([...chip().classList]).toEqual(
			expect.arrayContaining(['sv-variant-tonal', 'sv-color-neutral', 'sv-size-sm', 'sv-rounded'])
		);
		const box = chip().getBoundingClientRect();
		expect(box.height).toBeCloseTo(2.0582 * 16, 1);
		expect(Number.parseFloat(getComputedStyle(chip()).borderTopLeftRadius)).toBeGreaterThan(
			box.height / 2 - 1
		);
	});

	it('toggles when selectable, with aria-pressed and a check', async () => {
		await render(ChipHarness, { selected: false });
		expect(chip().tagName).toBe('BUTTON');
		expect(chip().getAttribute('aria-pressed')).toBe('false');
		await page.getByRole('button', { name: 'Euro' }).click();
		expect(chip().getAttribute('aria-pressed')).toBe('true');
		expect(state()).toBe('true');
		expect(chip().classList).toContain('sv-variant-flat');
		expect(chip().querySelector('svg')).not.toBeNull();
		chip().focus();
		await userEvent.keyboard('[Space]');
		expect(state()).toBe('false');
		expect(chip().classList).toContain('sv-variant-tonal');
	});

	it('replaces its prepend with the check while selected', async () => {
		const screen = await render(ChipHarness, { selected: false, withPrepend: true });
		expect(page.getByTestId('prepend').query()).not.toBeNull();
		await screen.rerender({ selected: true });
		expect(page.getByTestId('prepend').query()).toBeNull();
	});

	it('is a button with onclick and a link with href', async () => {
		const onclick = vi.fn();
		const screen = await render(ChipHarness, { onclick });
		expect(chip().tagName).toBe('BUTTON');
		expect(chip().getAttribute('type')).toBe('button');
		await page.getByRole('button', { name: 'Euro' }).click();
		expect(onclick).toHaveBeenCalledOnce();
		await screen.rerender({ onclick: undefined, href: '/currencies/eur' });
		expect(chip().tagName).toBe('A');
		expect(chip().getAttribute('href')).toBe('/currencies/eur');
		expect(chip().hasAttribute('disabled')).toBe(false);
	});

	it('cannot be pressed when disabled, and a disabled link goes nowhere', async () => {
		const onclick = vi.fn();
		const screen = await render(ChipHarness, { onclick, disabled: true });
		expect(chip().hasAttribute('disabled')).toBe(true);
		chip().click();
		expect(onclick).not.toHaveBeenCalled();
		await screen.rerender({ onclick: undefined, href: '/currencies/eur' });
		expect(chip().hasAttribute('href')).toBe(false);
		expect(chip().getAttribute('aria-disabled')).toBe('true');
	});

	it('has a close button that calls onclose, named for what it removes', async () => {
		const onclose = vi.fn();
		const screen = await render(ChipHarness, { closable: true, onclose });
		await page.getByRole('button', { name: 'Close' }).click();
		expect(onclose).toHaveBeenCalledOnce();
		await screen.rerender({ closeLabel: 'Remove Euro' });
		await expect.element(page.getByRole('button', { name: 'Remove Euro' })).toBeVisible();
		await screen.rerender({ disabled: true });
		expect(page.getByRole('button', { name: 'Remove Euro' }).element()).toHaveProperty(
			'disabled',
			true
		);
	});

	it('refuses to be closable and a button at once', async () => {
		await expect(async () => {
			await render(ChipHarness, { closable: true, onclick: () => {} });
		}).rejects.toThrow('[sveltier] Chip: a closable chip cannot also be a button or a link.');
	});
});
