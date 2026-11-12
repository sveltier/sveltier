import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Card from './Card.svelte';

const content = createRawSnippet(() => ({ render: () => '<p>$12,480.00</p>' }));

// Runs in Node: the markup the server sends.
describe('Card on the server', () => {
	it('renders the header, its title an h2 by default, and the content', () => {
		const { body } = render(Card, { props: { title: 'Savings', children: content } });
		expect(body).toContain('sv-variant-elevated');
		expect(body).toMatch(/<h2 class="sv-card__title">\s*Savings/);
		expect(body).toContain('<p>$12,480.00</p>');
	});
});
