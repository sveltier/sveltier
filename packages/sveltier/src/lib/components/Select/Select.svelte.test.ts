import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SelectHarness from '../../../tests/fixtures/SelectHarness.svelte';

const combobox = () => page.getByRole('combobox', { name: 'Market' });
const control = () => combobox().element() as HTMLElement;
const listbox = () => page.getByRole('listbox', { name: 'Market' });
const option = (name: string) => page.getByRole('option', { name, exact: true });
const value = () => page.getByTestId('value');
const active = () => {
	const id = control().getAttribute('aria-activedescendant');
	return id ? document.getElementById(id)?.querySelector('.sv-listbox__label')?.textContent : null;
};
const press = async (keys: string) => {
	control().focus();
	await userEvent.keyboard(keys);
};

describe('Select', () => {
	it('opens a labelled list of options in groups, pointing at the first one', async () => {
		await render(SelectHarness, {});
		await combobox().click();
		await expect.element(listbox()).toBeVisible();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		expect(control().getAttribute('aria-controls')).toBe(listbox().element().id);
		expect(page.getByRole('group', { name: 'Binance' }).elements()).toHaveLength(1);
		expect(page.getByRole('group', { name: 'Coinbase' }).elements()).toHaveLength(1);
		expect(active()).toBe('BTC/USDT');
		await expect.element(option('BTC/USDT')).toHaveAttribute('aria-selected', 'true');
	});

	it('moves with the arrows past a disabled option and chooses with Enter, keeping focus', async () => {
		await render(SelectHarness, { value: 'btc-usd' });
		await press('{ArrowDown}');
		expect(active()).toBe('BTC/USD');
		await userEvent.keyboard('{ArrowDown}');
		expect(active()).toBe('SOL/USD');
		await userEvent.keyboard('{Enter}');
		await expect.element(value()).toHaveTextContent('sol-usd');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(combobox()).toHaveFocus();
		await expect.element(combobox()).toHaveTextContent('SOL/USD');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('sol-usd');
	});

	it('jumps to the end, the start and by ten', async () => {
		await render(SelectHarness, {});
		await press('{End}');
		expect(active()).toBe('SOL/USD');
		await userEvent.keyboard('{Home}');
		expect(active()).toBe('BTC/USDT');
		await userEvent.keyboard('{PageDown}');
		expect(active()).toBe('SOL/USD');
	});

	it('opens on the option a typed label starts with', async () => {
		await render(SelectHarness, {});
		await press('s');
		await expect.element(listbox()).toBeVisible();
		expect(active()).toBe('SOL/USD');
		await userEvent.keyboard('{Enter}');
		await expect.element(value()).toHaveTextContent('sol-usd');
	});

	it('closes with Escape without choosing', async () => {
		await render(SelectHarness, { value: 'eth-usdt' });
		await press('{ArrowDown}{ArrowDown}{Escape}');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(value()).toHaveTextContent('eth-usdt');
		await expect.element(combobox()).toHaveFocus();
	});

	it('chooses the option pointed at on Tab, and moves on', async () => {
		await render(SelectHarness, {});
		await press('{ArrowDown}{ArrowDown}{Tab}');
		await expect.element(value()).toHaveTextContent('eth-usdt');
		await expect.element(page.getByRole('textbox', { name: 'Next' })).toHaveFocus();
	});

	it('chooses an option with a click, and not a disabled one', async () => {
		await render(SelectHarness, {});
		await combobox().click();
		await option('ETH/USD').click({ force: true });
		await expect.element(value()).toHaveTextContent('null');
		await option('ETH/BTC').click();
		await expect.element(value()).toHaveTextContent('eth-btc');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes on a press outside', async () => {
		await render(SelectHarness, {});
		await combobox().click();
		await expect.element(listbox()).toBeVisible();
		// The label sits above the field's box, clear of the list that covers what is below.
		await page.getByText('Market', { exact: true }).click();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('submits the chosen value with the form', async () => {
		await render(SelectHarness, { value: 'eth-btc' });
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('market=eth-btc');
	});

	it('does not open while disabled or read-only', async () => {
		await render(SelectHarness, { readonly: true });
		await press('{ArrowDown}');
		await combobox().click();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(combobox()).toHaveAttribute('aria-readonly', 'true');
	});

	it('is out of the tab order while disabled', async () => {
		await render(SelectHarness, { disabled: true });
		expect(control().tabIndex).toBe(-1);
		await expect.element(combobox()).toHaveAttribute('aria-disabled', 'true');
	});
});
