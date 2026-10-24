import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import FormHarness from '../../../tests/fixtures/FormHarness.svelte';

const name = () => page.getByRole('textbox', { name: 'Name' });
const email = () => page.getByRole('textbox', { name: 'Email' });
const submit = () => page.getByRole('button', { name: 'Sign up' });
const errors = () =>
	[...document.querySelectorAll('.sv-field__error')].map((node) => node.textContent);

describe('Form', () => {
	it('stops an invalid submission, shows every message and focuses the first invalid field', async () => {
		const onsubmit = vi.fn();
		const onlater = vi.fn();
		await render(FormHarness, { onsubmit, onlater });
		await email().fill('ada');
		await submit().click();
		expect(onsubmit).not.toHaveBeenCalled();
		// A listener added after the form's own, as SvelteKit's enhance is, never runs either.
		expect(onlater).not.toHaveBeenCalled();
		expect(errors()).toEqual(['Required', 'Enter a valid email address']);
		await expect.element(name()).toHaveFocus();
		await expect.element(name()).toHaveAccessibleDescription('Required');
	});

	it('calls onsubmit when every field is valid', async () => {
		const onsubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
		const onlater = vi.fn();
		await render(FormHarness, { onsubmit, onlater });
		await name().fill('Ada');
		await email().fill('ada@example.com');
		await submit().click();
		expect(onsubmit).toHaveBeenCalledOnce();
		expect(onlater).toHaveBeenCalledOnce();
		expect(errors()).toEqual([]);
	});

	it('gives its fields its validateOn, unless a field sets its own', async () => {
		await render(FormHarness, { validateOn: 'input', emailValidateOn: 'submit' });
		await name().fill('A');
		await name().fill('');
		await expect.element(name()).toHaveAccessibleDescription('Required');
		await email().fill('ada');
		await userEvent.keyboard('{Tab}');
		expect(errors()).toEqual(['Required']);
	});

	it('disables every control inside, buttons included', async () => {
		const screen = await render(FormHarness, { disabled: true });
		expect((name().element() as HTMLInputElement).disabled).toBe(true);
		expect((submit().element() as HTMLButtonElement).disabled).toBe(true);
		await screen.rerender({ disabled: false });
		expect((name().element() as HTMLInputElement).disabled).toBe(false);
	});

	it('resets the values and hides the messages', async () => {
		await render(FormHarness, { onsubmit: (event) => event.preventDefault() });
		await name().fill('Ada');
		await email().fill('ada');
		await submit().click();
		expect(errors()).toEqual(['Enter a valid email address']);
		await page.getByRole('button', { name: 'Clear' }).click();
		await expect.element(page.getByTestId('values')).toHaveTextContent('|');
		expect(errors()).toEqual([]);
	});

	it('offers validate and resetValidation through bind:this', async () => {
		await render(FormHarness);
		await page.getByRole('button', { name: 'Validate' }).click();
		await expect.element(page.getByTestId('validity')).toHaveTextContent('false');
		expect(errors()).toEqual(['Required', 'Required']);
		await page.getByRole('button', { name: 'Hide messages' }).click();
		expect(errors()).toEqual([]);
	});
});
