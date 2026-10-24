import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import NativeSelectHarness from '../../../tests/fixtures/NativeSelectHarness.svelte';

const select = () => page.getByRole('combobox', { name: 'Country' });
const element = () => select().element() as HTMLSelectElement;
const value = () => page.getByTestId('value');

describe('NativeSelect', () => {
	it('is a labelled select whose value binds both ways', async () => {
		const screen = await render(NativeSelectHarness, { value: 'vn' });
		expect(element().tagName).toBe('SELECT');
		expect(element().selectedOptions[0]?.textContent).toBe('Vietnam');
		await select().selectOptions('United Kingdom');
		await expect.element(value()).toHaveTextContent('gb');
		await screen.rerender({ value: 'vn' });
		expect(element().selectedOptions[0]?.textContent).toBe('Vietnam');
	});

	it('starts on its placeholder with no value, and keeps disabled options out of reach', async () => {
		await render(NativeSelectHarness, { placeholder: 'Choose a country' });
		expect(element().selectedOptions[0]?.textContent).toBe('Choose a country');
		await expect.element(value()).toHaveTextContent('null');
		const japan = [...element().options].find((option) => option.textContent === 'Japan');
		expect(japan?.disabled).toBe(true);
	});

	it('says that a required choice is required, and submits the chosen value', async () => {
		await render(NativeSelectHarness, { placeholder: 'Choose a country', required: true });
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('');
		expect(element().validationMessage).toBe('Required');
		await select().selectOptions('Vietnam');
		await userEvent.keyboard('{Tab}');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('country=vn');
	});

	it('goes back to the choice it started with on a form reset', async () => {
		await render(NativeSelectHarness, { value: 'vn' });
		await select().selectOptions('United Kingdom');
		await expect.element(value()).toHaveTextContent('gb');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(value()).toHaveTextContent('vn');
		expect(element().selectedOptions[0]?.textContent).toBe('Vietnam');
	});

	it('shows the placeholder like a text field placeholder, and the arrow over the end', async () => {
		await render(NativeSelectHarness, { placeholder: 'Choose a country' });
		const field = element().closest('.sv-field') as HTMLElement;
		expect(field.classList).toContain('sv-native-select--empty');
		const arrow = getComputedStyle(field.querySelector('.sv-field__box')!, '::before');
		expect(arrow.pointerEvents).toBe('none');
		await select().selectOptions('Vietnam');
		expect(field.classList).not.toContain('sv-native-select--empty');
	});
});
