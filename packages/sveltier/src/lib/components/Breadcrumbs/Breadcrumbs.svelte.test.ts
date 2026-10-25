import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BreadcrumbsHarness from '../../../tests/fixtures/BreadcrumbsHarness.svelte';

describe('Breadcrumbs', () => {
	it('is a navigation landmark named Breadcrumb, with the steps in an ordered list', async () => {
		await render(BreadcrumbsHarness);
		const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
		await expect.element(nav).toBeVisible();
		expect(nav.element().querySelector('ol')?.children).toHaveLength(3);
	});

	it('links the steps above the page, unread separators between them', async () => {
		await render(BreadcrumbsHarness);
		await expect
			.element(page.getByRole('link', { name: 'Accounts', exact: true }))
			.toHaveAttribute('href', '/accounts');
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
		// The drawn separator is not part of any name.
		await expect.element(page.getByRole('navigation')).toHaveAccessibleName('Breadcrumb');
	});

	it('marks the last step as the current page, a link or not', async () => {
		const screen = await render(BreadcrumbsHarness);
		const current = () => [...document.querySelectorAll('[aria-current="page"]')];
		expect(current().map((step) => step.textContent)).toEqual(['Savings']);
		expect(current()[0]?.tagName).toBe('SPAN');
		await screen.rerender({
			items: [
				{ label: 'Accounts', href: '/accounts' },
				{ label: 'Savings', href: '/accounts/savings' }
			]
		});
		await expect
			.element(page.getByRole('link', { name: 'Savings' }))
			.toHaveAttribute('aria-current', 'page');
		expect(current()).toHaveLength(1);
	});

	it('takes another name from aria-label', async () => {
		await render(BreadcrumbsHarness, { label: 'You are here' });
		await expect.element(page.getByRole('navigation', { name: 'You are here' })).toBeVisible();
	});
});
