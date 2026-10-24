import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { Variant } from '../../core/props/types.js';
import Field from './Field.svelte';
import type { FieldControlAttributes, FieldVariant } from './types.js';

// Every field variant is one of the shared variants (checked by the type checker).
const shared: readonly Variant[] = [] as FieldVariant[];

// A custom control: it spreads what the Field passes, as an app's own control would.
const control = createRawSnippet((attributes: () => FieldControlAttributes) => ({
	render: () => {
		const { id, class: className, 'aria-describedby': describedBy } = attributes();
		return `<input id="${id}" class="${className}" aria-describedby="${describedBy ?? ''}" />`;
	}
}));

// Runs in Node: the markup the server sends before any script runs.
describe('Field on the server', () => {
	it('wraps a custom control and links the label and hint to it', () => {
		const { body } = render(Field, {
			props: { id: 'iban', label: 'IBAN', hint: 'Starts with the country code', children: control }
		});
		expect(shared).toEqual([]);
		expect(body).toContain('<label class="sv-field__label" for="iban" id="iban-label">IBAN');
		expect(body).toContain(
			'<input id="iban" class="sv-field__control" aria-describedby="iban-hint" />'
		);
	});

	it('generates the control id when none is given', () => {
		const { body } = render(Field, { props: { label: 'IBAN', children: control } });
		const id = /<input id="([^"]+)"/.exec(body)?.[1];
		expect(id).toBeTruthy();
		expect(body).toContain(`for="${id}"`);
	});

	it('puts its other attributes on the root', () => {
		const { body } = render(Field, {
			props: { label: 'IBAN', 'data-section': 'payout', children: control }
		});
		expect(body).toMatch(/<div[^>]*data-section="payout"[^>]*class="sv-field /);
	});
});
