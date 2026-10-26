import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ComboboxHarness from '../../../tests/fixtures/ComboboxHarness.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown> = {}) =>
	render(ComboboxHarness, { props }).body.replace(/<!--.*?-->/g, '');

describe('Combobox on the server', () => {
	it('renders a labelled text field in the combobox role, closed', () => {
		const body = html();
		expect(body).toMatch(/<input[^>]*role="combobox"[^>]*aria-autocomplete="list"/);
		expect(body).toMatch(/aria-expanded="false"/);
		expect(body).not.toContain('role="listbox"');
	});

	it('shows the chosen label and submits the value, not the text', () => {
		const body = html({ value: 'dn' });
		expect(body).toMatch(/role="combobox"[^>]*value="Đà Nẵng"/);
		expect(body).toContain('<input type="hidden" name="city" value="dn"/>');
	});
});
