import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import BreadcrumbsHarness from '../../../tests/fixtures/BreadcrumbsHarness.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Breadcrumbs on the server', () => {
	it('renders the landmark, the links and the current page', () => {
		const { body } = render(BreadcrumbsHarness);
		expect(body).toMatch(/<nav[^>]*aria-label="Breadcrumb"/);
		expect(body).toMatch(/<a[^>]*href="\/accounts"[^>]*>Accounts<\/a>/);
		expect(body.match(/aria-current="page"/g)).toHaveLength(1);
		expect(body).toMatch(/<span aria-current="page">Savings<\/span>/);
	});
});
