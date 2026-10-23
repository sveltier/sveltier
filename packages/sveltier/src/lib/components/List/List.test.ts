import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ListItem from './ListItem.svelte';

// Runs in Node: the markup the server sends.
describe('ListItem on the server', () => {
	it('renders a list item whose row is a link with its current page', () => {
		const { body } = render(ListItem, {
			props: { title: 'Statements', href: '/statements', active: true }
		});
		expect(body).toContain('<li class="sv-list-item sv-list-item--active"');
		expect(body).toContain('href="/statements"');
		expect(body).toContain('aria-current="page"');
	});
});
