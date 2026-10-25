import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PaginationHarness from '../../../tests/fixtures/PaginationHarness.svelte';

const nav = () => page.getByRole('navigation', { name: 'Pagination' });
const pageControl = (n: number) => page.getByRole('button', { name: `Page ${n}`, exact: true });
const step = (name: 'Previous page' | 'Next page') =>
	page.getByRole('button', { name, exact: true });
const shown = () =>
	[...document.querySelectorAll('.sv-pagination__list > li')].map((item) =>
		item.classList.contains('sv-pagination__gap') ? '…' : (item.textContent?.trim() ?? '')
	);

describe('Pagination', () => {
	it('is a navigation landmark of named page controls, between previous and next', async () => {
		await render(PaginationHarness);
		await expect.element(nav()).toBeVisible();
		await expect.element(pageControl(1)).toHaveAttribute('aria-current', 'page');
		expect(shown()).toEqual(['', '1', '2', '3', '4', '5', '…', '10', '']);
		expect(document.querySelector('.sv-pagination__gap')?.getAttribute('aria-hidden')).toBe('true');
	});

	it('moves with the steps and the numbers, and reports each move', async () => {
		await render(PaginationHarness);
		await expect.element(step('Previous page')).toBeDisabled();
		await step('Next page').click();
		await expect.element(pageControl(2)).toHaveAttribute('aria-current', 'page');
		await pageControl(10).click();
		await expect.element(page.getByTestId('page')).toHaveTextContent('10');
		await expect.element(step('Next page')).toBeDisabled();
		expect(shown()).toEqual(['', '1', '…', '6', '7', '8', '9', '10', '']);
		await expect.element(page.getByTestId('changes')).toHaveTextContent('2 10');
	});

	it('keeps as many controls wherever the page is', async () => {
		const screen = await render(PaginationHarness, { page: 5 });
		expect(shown()).toEqual(['', '1', '…', '4', '5', '6', '…', '10', '']);
		await screen.rerender({ page: 9 });
		expect(shown()).toHaveLength(9);
	});

	it('makes the pages links to their addresses with href', async () => {
		await render(PaginationHarness, { links: true, page: 1 });
		await expect
			.element(page.getByRole('link', { name: 'Page 3', exact: true }))
			.toHaveAttribute('href', '#page-3');
		await expect
			.element(page.getByRole('link', { name: 'Page 1', exact: true }))
			.toHaveAttribute('aria-current', 'page');
		// No page before the first: the step is a link that goes nowhere.
		const previous = page.getByRole('link', { name: 'Previous page' });
		await expect.element(previous).toHaveAttribute('aria-disabled', 'true');
		await expect.element(previous).not.toHaveAttribute('href');
		await page.getByRole('link', { name: 'Page 3', exact: true }).click();
		await expect.element(page.getByTestId('page')).toHaveTextContent('3');
	});

	it('holds a page out of range to the nearest one', async () => {
		await render(PaginationHarness, { page: 99 });
		await expect.element(pageControl(10)).toHaveAttribute('aria-current', 'page');
	});

	it('turns the chevrons in right-to-left pages', async () => {
		await render(PaginationHarness, { dir: 'rtl' });
		const chevron = document.querySelector('.sv-pagination__step svg') as SVGElement;
		expect(getComputedStyle(chevron).transform).toBe('matrix(-1, 0, 0, 1, 0, 0)');
	});
});
