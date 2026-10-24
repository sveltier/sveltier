import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NumberField from './NumberField.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('NumberField on the server', () => {
	it('renders a spinbutton with its range, the formatted value and a hidden plain value', () => {
		const { body } = render(NumberField, {
			props: { label: 'Amount', id: 'amount', name: 'amount', value: 1234.5, min: 0, max: 10000 }
		});
		expect(body).toMatch(/<input[^>]*id="amount"[^>]*role="spinbutton"/);
		expect(body).toContain('aria-valuenow="1234.5"');
		expect(body).toContain('aria-valuemin="0"');
		expect(body).toContain('aria-valuemax="10000"');
		expect(body).toContain('value="1,234.5"');
		expect(body).toContain('<input type="hidden" name="amount" value="1234.5"');
		expect(body).toContain('aria-label="Increase"');
	});

	it('leaves the buttons out when controls is false', () => {
		const { body } = render(NumberField, { props: { label: 'Amount', controls: false } });
		expect(body).not.toContain('sv-number-field__steps');
	});
});
