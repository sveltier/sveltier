import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.svelte';

// Runs in Node: the markup the server sends.
describe('Badge on the server', () => {
	it('renders the count hidden from assistive technology, and what it says', () => {
		const { body } = render(Badge, { props: { content: 5, label: 'new payments' } });
		expect(body).toMatch(/aria-hidden="true"><span[^>]*>5<\/span>/);
		expect(body).toContain('5 new payments');
		expect(body).toContain('sv-badge--inline');
	});
});
