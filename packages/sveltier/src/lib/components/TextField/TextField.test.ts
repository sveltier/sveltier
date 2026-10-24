import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TextField from './TextField.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('TextField on the server', () => {
	it('renders a labelled input in a field with its shared classes', () => {
		const { body } = render(TextField, { props: { label: 'Email', id: 'email', name: 'email' } });
		expect(body).toContain(
			'class="sv-field sv-variant-outlined sv-density-default sv-size-md sv-color-primary sv-rounded"'
		);
		expect(body).toContain('<label class="sv-field__label" for="email" id="email-label">Email');
		expect(body).toMatch(/<input[^>]*name="email"[^>]*id="email"[^>]*type="text"/);
	});

	it('marks a required field and describes it with its hint', () => {
		const { body } = render(TextField, {
			props: { label: 'Email', id: 'email', required: true, hint: 'For receipts' }
		});
		expect(body).toContain('<span class="sv-field__required" aria-hidden="true">*</span>');
		expect(body).toContain('aria-describedby="email-hint"');
		expect(body).toContain('<p class="sv-field__hint" id="email-hint">For receipts</p>');
		expect(body).toMatch(/<input[^>]*required/);
		// A required field is not shown as invalid before the user has done anything.
		expect(body).not.toContain('aria-invalid');
		expect(body).not.toContain('Required');
	});

	it('renders an error from outside in place of the hint', () => {
		const { body } = render(TextField, {
			props: { label: 'Email', id: 'email', hint: 'For receipts', error: 'This address is taken' }
		});
		expect(body).toContain('sv-field--invalid');
		expect(body).toContain('aria-invalid="true"');
		expect(body).toContain('aria-describedby="email-error"');
		expect(body).toContain('<p class="sv-field__error" id="email-error">This address is taken</p>');
		expect(body).not.toContain('For receipts');
	});

	it('renders the variant and the states as classes', () => {
		const { body } = render(TextField, {
			props: { label: 'Email', variant: 'tonal', disabled: true, readonly: true }
		});
		expect(body).toContain('sv-variant-tonal');
		expect(body).toContain('sv-field--disabled');
		expect(body).toContain('sv-field--readonly');
		expect(body).toMatch(/<input[^>]*disabled/);
		expect(body).toMatch(/<input[^>]*readonly/);
	});
});
