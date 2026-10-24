import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TextFieldHarness from '../../../tests/fixtures/TextFieldHarness.svelte';

const input = () => page.getByRole('textbox', { name: 'Email' });
const element = () => input().element() as HTMLInputElement;
const field = () => element().closest('.sv-field') as HTMLElement;
const box = () => field().querySelector('.sv-field__box') as HTMLElement;
const error = () => field().querySelector('.sv-field__error');

/** Changes the value as the user would (an input event), then moves focus to the next field. */
async function fillAndLeave(text: string) {
	await input().fill(text);
	await userEvent.keyboard('{Tab}');
}

describe('TextField', () => {
	it('is a labelled input whose value binds both ways', async () => {
		const screen = await render(TextFieldHarness, { value: 'ada@example.com' });
		expect(element().value).toBe('ada@example.com');
		await input().fill('grace@example.com');
		await expect.element(page.getByTestId('value')).toHaveTextContent('grace@example.com');
		await screen.rerender({ value: 'alan@example.com' });
		expect(element().value).toBe('alan@example.com');
	});

	it('gives the input its attributes and the field its class and style', async () => {
		await render(TextFieldHarness, {
			name: 'email',
			placeholder: 'name@example.com',
			autocomplete: 'email',
			class: 'signup-email',
			style: 'max-inline-size: 20rem'
		});
		expect(element().name).toBe('email');
		expect(element().placeholder).toBe('name@example.com');
		expect(element().getAttribute('autocomplete')).toBe('email');
		expect(element().type).toBe('text');
		expect(field().classList).toContain('signup-email');
		expect(field().style.maxInlineSize).toBe('20rem');
		expect(element().classList).not.toContain('signup-email');
	});

	it('shows nothing while the user only tabs through', async () => {
		await render(TextFieldHarness, { required: true });
		element().focus();
		await userEvent.keyboard('{Tab}');
		expect(document.activeElement?.getAttribute('aria-label')).toBe('Next');
		expect(error()).toBeNull();
		expect(element().hasAttribute('aria-invalid')).toBe(false);
	});

	it('shows the message when the user leaves after a change, and clears it once fixed', async () => {
		await render(TextFieldHarness, { type: 'email' });
		await input().fill('ada');
		expect(error()).toBeNull();
		await userEvent.keyboard('{Tab}');
		await expect.element(input()).toHaveAccessibleDescription('Enter a valid email address');
		expect(element().getAttribute('aria-invalid')).toBe('true');
		await input().fill('ada@example.com');
		expect(error()).toBeNull();
		expect(element().hasAttribute('aria-invalid')).toBe(false);
	});

	it('shows the message from the first change with validateOn input', async () => {
		await render(TextFieldHarness, { type: 'email', validateOn: 'input' });
		await input().fill('a');
		await expect.element(input()).toHaveAccessibleDescription('Enter a valid email address');
	});

	it('waits for the form with validateOn submit', async () => {
		await render(TextFieldHarness, { type: 'email', validateOn: 'submit' });
		await fillAndLeave('ada');
		expect(error()).toBeNull();
	});

	it('runs the rules in order after the constraints, but not on an empty optional field', async () => {
		await render(TextFieldHarness, {
			minlength: 3,
			rules: [
				(value: string) => value.includes('@') || 'Include an @',
				(value: string) => value.endsWith('.com') || 'Use a .com address'
			]
		});
		await fillAndLeave('ad');
		await expect.element(input()).toHaveAccessibleDescription('Enter at least 3 characters');
		await input().fill('ada');
		await expect.element(input()).toHaveAccessibleDescription('Include an @');
		await input().fill('ada@example.org');
		await expect.element(input()).toHaveAccessibleDescription('Use a .com address');
		await input().fill('');
		expect(error()).toBeNull();
	});

	it('says that a required field is required', async () => {
		await render(TextFieldHarness, { required: true });
		await input().fill('a');
		await fillAndLeave('');
		await expect.element(input()).toHaveAccessibleDescription('Required');
		expect(element().required).toBe(true);
		const asterisk = field().querySelector('.sv-field__required');
		expect(asterisk?.getAttribute('aria-hidden')).toBe('true');
	});

	it('shows an error from outside at once: a message, the first of a list, or only the state', async () => {
		const screen = await render(TextFieldHarness, { error: 'This address is taken' });
		await expect.element(input()).toHaveAccessibleDescription('This address is taken');
		await screen.rerender({ error: ['First problem', 'Second problem'] });
		await expect.element(input()).toHaveAccessibleDescription('First problem');
		await screen.rerender({ error: true });
		expect(element().getAttribute('aria-invalid')).toBe('true');
		expect(error()).toBeNull();
		await screen.rerender({ error: null });
		expect(element().hasAttribute('aria-invalid')).toBe(false);
	});

	it('keeps the native validity in step, so a plain form refuses to submit', async () => {
		const onsubmit = vi.fn();
		await render(TextFieldHarness, { inForm: true, onsubmit, required: true });
		expect(element().validationMessage).toBe('Required');
		await page.getByRole('button', { name: 'Send' }).click();
		expect(onsubmit).not.toHaveBeenCalled();
		await input().fill('ada@example.com');
		expect(element().validity.valid).toBe(true);
		await page.getByRole('button', { name: 'Send' }).click();
		expect(onsubmit).toHaveBeenCalledOnce();
	});

	it('keeps an error from outside out of the native validity', async () => {
		await render(TextFieldHarness, { error: 'This address is taken', value: 'ada@example.com' });
		expect(element().validity.valid).toBe(true);
	});

	it('joins the app’s aria-describedby with its hint', async () => {
		await render(TextFieldHarness, { hint: 'We never share it', 'aria-describedby': 'terms' });
		const ids = element().getAttribute('aria-describedby')?.split(' ');
		expect(ids).toEqual(['terms', `${element().id}-hint`]);
	});

	it('focuses the input on a press anywhere in the box, except on a button in it', async () => {
		await render(TextFieldHarness, { withIcon: true, withAction: true });
		await page.getByTestId('icon').click();
		expect(document.activeElement).toBe(element());
		await page.getByRole('button', { name: 'Show' }).click();
		expect(document.activeElement).not.toBe(element());
	});

	it('does not count a move to a button inside the field as leaving it', async () => {
		await render(TextFieldHarness, { type: 'email', withAction: true });
		await input().fill('ada');
		await userEvent.keyboard('{Tab}');
		expect(document.activeElement?.textContent?.trim()).toBe('Show');
		expect(error()).toBeNull();
		await userEvent.keyboard('{Tab}');
		await expect.element(input()).toHaveAccessibleDescription('Enter a valid email address');
	});

	it('cannot be focused when disabled', async () => {
		await render(TextFieldHarness, { disabled: true });
		expect(element().disabled).toBe(true);
		expect(field().classList).toContain('sv-field--disabled');
	});

	it('is as tall as a Button of the same size', async () => {
		await render(TextFieldHarness);
		const button = page.getByRole('button', { name: 'Same height' }).element();
		expect(box().getBoundingClientRect().height).toBeCloseTo(
			button.getBoundingClientRect().height,
			0
		);
	});

	it('draws each variant: a border, a rule under the text, or nothing', async () => {
		const screen = await render(TextFieldHarness);
		const widths = () => {
			const style = getComputedStyle(box());
			return [style.borderBlockStartWidth, style.borderBlockEndWidth];
		};
		expect(widths()).toEqual(['1px', '1px']);
		await screen.rerender({ variant: 'text' });
		expect(widths()).toEqual(['0px', '1px']);
		await screen.rerender({ variant: 'plain' });
		expect(getComputedStyle(box()).borderBlockEndColor).toBe('rgba(0, 0, 0, 0)');
	});

	it('shows its accent while focused', async () => {
		await render(TextFieldHarness);
		const accent = () => getComputedStyle(box(), '::after').opacity;
		expect(accent()).toBe('0');
		element().focus();
		await expect.poll(accent).toBe('1');
	});
});
