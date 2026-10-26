import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ComboboxHarness from '../../../tests/fixtures/ComboboxHarness.svelte';

const combobox = () => page.getByRole('combobox', { name: 'City' });
const input = () => combobox().element() as HTMLInputElement;
const listbox = () => page.getByRole('listbox', { name: 'City' });
const options = () =>
	[...document.querySelectorAll('[role="option"] .sv-listbox__label')].map(
		(label) => label.textContent
	);
const active = () => {
	const id = input().getAttribute('aria-activedescendant');
	return id ? document.getElementById(id)?.querySelector('.sv-listbox__label')?.textContent : null;
};
const value = () => page.getByTestId('value');

describe('Combobox', () => {
	it('filters as the user types, ignoring case and diacritics, and points at the first match', async () => {
		await render(ComboboxHarness, {});
		await combobox().fill('ha noi');
		await expect.element(listbox()).toBeVisible();
		expect(options()).toEqual(['Hà Nội']);
		expect(active()).toBe('Hà Nội');
		await userEvent.keyboard('{Enter}');
		await expect.element(value()).toHaveTextContent('hn');
		expect(input().value).toBe('Hà Nội');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('reads đ as d, and matches the description', async () => {
		await render(ComboboxHarness, {});
		await combobox().fill('da');
		expect(options()).toEqual(['Đà Nẵng']);
		await combobox().fill('thu do');
		expect(options()).toEqual(['Hà Nội']);
	});

	it('opens on every item with the arrows, on the chosen one, in groups', async () => {
		await render(ComboboxHarness, { value: 'dn' });
		input().focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(options()).toHaveLength(6);
		expect(active()).toBe('Đà Nẵng');
		expect(page.getByRole('group', { name: 'Centre' }).elements()).toHaveLength(1);
		await userEvent.keyboard('{ArrowDown}');
		expect(active()).toBe('Hồ Chí Minh');
	});

	it('says when nothing matches', async () => {
		await render(ComboboxHarness, {});
		await combobox().fill('xyz');
		await expect.element(page.getByRole('status')).toHaveTextContent('No matches');
	});

	it('puts back the chosen label when the user leaves what they typed', async () => {
		await render(ComboboxHarness, { value: 'hp' });
		await combobox().fill('hồ');
		await userEvent.keyboard('{Tab}');
		expect(input().value).toBe('Hải Phòng');
		await expect.element(value()).toHaveTextContent('hp');
	});

	it('clears the value when the user empties the field', async () => {
		await render(ComboboxHarness, { value: 'hp' });
		await combobox().fill('');
		await userEvent.keyboard('{Tab}');
		await expect.element(value()).toHaveTextContent('null');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('null');
	});

	it('closes with Escape, then puts back the chosen label with a second one', async () => {
		await render(ComboboxHarness, { value: 'ct' });
		await combobox().fill('ha');
		await userEvent.keyboard('{Escape}');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		expect(input().value).toBe('ha');
		await userEvent.keyboard('{Escape}');
		expect(input().value).toBe('Cần Thơ');
	});

	it('chooses with a click', async () => {
		await render(ComboboxHarness, {});
		await combobox().fill('h');
		await page.getByRole('option', { name: 'Hồ Chí Minh' }).click();
		await expect.element(value()).toHaveTextContent('hcm');
		expect(input().value).toBe('Hồ Chí Minh');
	});

	it('does not choose with the Enter that confirms an input method word', async () => {
		await render(ComboboxHarness, {});
		await combobox().fill('ha');
		input().dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })
		);
		await expect.element(value()).toHaveTextContent('null');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
	});

	it('leaves the items as given without a filter, and binds what is typed', async () => {
		await render(ComboboxHarness, { filter: false });
		await combobox().fill('zz');
		await expect.element(page.getByTestId('query')).toHaveTextContent('zz');
		expect(options()).toHaveLength(6);
	});

	it('says it is loading while it has no items', async () => {
		await render(ComboboxHarness, { items: [], loading: true });
		await combobox().fill('ha');
		await expect.element(page.getByRole('status')).toHaveTextContent('Loading');
	});
});
