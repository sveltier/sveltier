import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import PaginationHarness from '../../../tests/fixtures/PaginationHarness.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Pagination on the server', () => {
	it('renders the landmark, the current page and a disabled first step', () => {
		const { body } = render(PaginationHarness, { props: { page: 1 } });
		expect(body).toMatch(/<nav[^>]*aria-label="Pagination"/);
		expect(body.match(/aria-current="page"/g)).toHaveLength(1);
		expect(body).toMatch(
			/<button[^>]*disabled[^>]*aria-label="Previous page"|<button[^>]*aria-label="Previous page"[^>]*disabled/
		);
	});

	it('renders links to the pages with href', () => {
		const { body } = render(PaginationHarness, { props: { page: 2, links: true } });
		expect(body).toMatch(/<a[^>]*href="#page-3"/);
	});
});
