import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Textarea from './Textarea.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Textarea on the server', () => {
	it('renders a labelled textarea in a field, with its rows', () => {
		const { body } = render(Textarea, { props: { label: 'Note', id: 'note', rows: 4 } });
		expect(body).toContain('class="sv-field sv-variant-outlined');
		expect(body).toContain('sv-textarea');
		expect(body).toContain('<label class="sv-field__label" for="note" id="note-label">Note');
		expect(body).toMatch(/<textarea[^>]*id="note"[^>]*rows="4"/);
	});

	it('marks a field that grows with its text', () => {
		const { body } = render(Textarea, { props: { label: 'Note', autoGrow: true, maxRows: 6 } });
		expect(body).toContain('sv-textarea--grow');
		expect(body).toContain('--sv-textarea-max: 6');
	});
});
