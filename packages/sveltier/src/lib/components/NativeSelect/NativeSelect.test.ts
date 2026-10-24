import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NativeSelect from './NativeSelect.svelte';

const OPTIONS = [
	{ value: 'gb', label: 'United Kingdom' },
	{ value: 'vn', label: 'Vietnam' }
];

// Runs in Node: the markup the server sends before any script runs.
describe('NativeSelect on the server', () => {
	it('renders a labelled select with the chosen option selected', () => {
		const { body } = render(NativeSelect, {
			props: { label: 'Country', id: 'country', name: 'country', options: OPTIONS, value: 'vn' }
		});
		expect(body).toContain('sv-native-select');
		expect(body).toContain('<label class="sv-field__label" for="country" id="country-label">');
		expect(body).toMatch(/<select[^>]*name="country"[^>]*id="country"/);
		expect(body).toMatch(/<option value="vn"[^>]*selected/);
		expect(body).not.toMatch(/<option value="gb"[^>]*selected/);
	});

	it('starts on the placeholder when nothing is chosen', () => {
		const { body } = render(NativeSelect, {
			props: { label: 'Country', options: OPTIONS, placeholder: 'Choose a country', required: true }
		});
		expect(body).toContain('sv-native-select--empty');
		expect(body).toMatch(/<option value=""[^>]*disabled[^>]*selected[^>]*>Choose a country/);
		expect(body).toMatch(/<select[^>]*required/);
	});
});
