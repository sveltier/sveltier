import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import LabelledFields from './fixtures/LabelledFields.svelte';

describe('component IDs on the server', () => {
	it('renders distinct IDs with their links, so they survive hydration', () => {
		const { body } = render(LabelledFields);
		const ids = Array.from(body.matchAll(/<input id="([^"]+)"/g), (match) => match[1]);

		expect(ids).toHaveLength(3);
		expect(new Set(ids).size).toBe(3);
		for (const id of ids) expect(body).toContain(`<label for="${id}" id="${id}-label">`);
		expect(body).toContain(`aria-describedby="${ids[0]}-hint"`);
		expect(body).toContain(`<p id="${ids[0]}-hint">`);
	});

	it('prefixes IDs per render, for several Svelte roots on one page', () => {
		const { body } = render(LabelledFields, { idPrefix: 'quote' });
		expect(body).toMatch(/<input id="quote-[^"]+"/);
	});
});
