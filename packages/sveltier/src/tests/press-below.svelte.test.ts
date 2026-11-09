import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PressBelowField from './fixtures/PressBelowField.svelte';

// A press on a button under a field moves focus out of the field, which shows its message. The
// message adds a line under the field; shown at once, it would move the button before the
// release, and the click would land elsewhere.
const save = () => page.getByRole('button', { name: 'Save' });
const clicks = () => page.getByTestId('clicks');

describe('a press below a field', () => {
	it('lands, and the message shows once its click has', async () => {
		await render(PressBelowField);
		const email = page.getByRole('textbox', { name: 'Email' });
		await email.fill('ada');
		await save().click();
		await expect.element(clicks()).toHaveTextContent('1');
		await expect.element(email).toHaveAccessibleDescription('Enter a valid email address');
	});

	it('lands after a file of another kind was chosen', async () => {
		await render(PressBelowField, { file: true });
		const backup = page.getByLabelText('Backup');
		(backup.element() as HTMLElement).focus();
		await userEvent.upload(backup, new File(['x'], 'notes.txt', { type: 'text/plain' }));
		await save().click();
		await expect.element(clicks()).toHaveTextContent('1');
		await expect.element(backup).toHaveAccessibleDescription('Choose a file of type .json');
	});

	it('shows the message after a press that makes no click', async () => {
		await render(PressBelowField);
		const email = page.getByRole('textbox', { name: 'Email' });
		await email.fill('ada');
		await save().click({ button: 'right' });
		await expect.element(email).toHaveAccessibleDescription('Enter a valid email address');
		expect(clicks().element().textContent).toBe('0');
	});

	it('shows the message at once when focus leaves by the keyboard', async () => {
		await render(PressBelowField);
		const email = page.getByRole('textbox', { name: 'Email' });
		await email.fill('ada');
		await userEvent.keyboard('{Tab}');
		expect(document.querySelector('.sv-field__error')?.textContent).toBe(
			'Enter a valid email address'
		);
	});
});
