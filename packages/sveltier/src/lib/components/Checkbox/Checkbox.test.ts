import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Checkbox from './Checkbox.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Checkbox on the server', () => {
	it('renders a native checkbox inside its label, checked as given', () => {
		const { body } = render(Checkbox, {
			props: { label: 'Email me a receipt', name: 'receipt', id: 'receipt', checked: true }
		});
		expect(body).toContain('sv-checkbox');
		expect(body).toMatch(/<label class="sv-choice__row">/);
		expect(body).toMatch(/<input[^>]*type="checkbox"/);
		expect(body).toMatch(/<input[^>]*name="receipt"/);
		expect(body).toMatch(/<input[^>]*\bchecked\b/);
		expect(body).toContain('Email me a receipt');
	});

	it('draws the dash for an indeterminate box before any script runs', () => {
		const { body } = render(Checkbox, {
			props: { label: 'Select all', indeterminate: true, required: true }
		});
		expect(body).toContain('sv-checkbox--indeterminate');
		expect(body).toMatch(/<input[^>]*required/);
		expect(body).toContain('<span class="sv-choice__required" aria-hidden="true">*</span>');
	});
});
