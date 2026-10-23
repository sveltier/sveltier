import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import LabelledFields from './fixtures/LabelledFields.svelte';

// The ID convention every component follows (see LabelledField).
describe('component IDs', () => {
	it('gives every instance its own ID and links its parts', async () => {
		await render(LabelledFields, { customId: 'recipient' });
		const amount = page.getByRole('textbox', { name: 'Amount' }).element();
		const reference = page.getByRole('textbox', { name: 'Reference' }).element();

		expect(amount.id).not.toBe('');
		expect(amount.id).not.toBe(reference.id);
		await expect
			.element(page.getByRole('textbox', { name: 'Amount' }))
			.toHaveAccessibleDescription('In your account currency');
		expect(document.getElementById(`${amount.id}-label`)?.textContent).toBe('Amount');
	});

	it('uses the id prop when given', async () => {
		await render(LabelledFields, { customId: 'recipient' });
		const recipient = page.getByRole('textbox', { name: 'Recipient' }).element();
		expect(recipient.id).toBe('recipient');
	});

	it('references only parts that render', async () => {
		await render(LabelledFields);
		const reference = page.getByRole('textbox', { name: 'Reference' }).element();
		expect(reference.hasAttribute('aria-describedby')).toBe(false);
	});
});
