import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ListHarness from '../../../tests/fixtures/ListHarness.svelte';

const item = (id: string) => page.getByTestId(id).element() as HTMLElement;
const main = (id: string) => item(id).querySelector<HTMLElement>('.sv-list-item__main')!;

describe('List', () => {
	it('is a list of rows, even without bullets', async () => {
		await render(ListHarness, {});
		await expect.element(page.getByRole('list')).toBeVisible();
		expect(page.getByRole('listitem').elements()).toHaveLength(4);
		expect(item('list').classList).toContain('sv-density-default');
	});

	it('makes rows links or buttons that fill the row', async () => {
		const onopen = vi.fn();
		await render(ListHarness, { onopen });
		expect(main('static').tagName).toBe('DIV');
		expect(main('link').tagName).toBe('A');
		expect(main('link').getAttribute('href')).toBe('/statements');
		expect(main('button').tagName).toBe('BUTTON');
		await page.getByRole('button', { name: 'Open account' }).click();
		expect(onopen).toHaveBeenCalledOnce();
		expect(main('link').getBoundingClientRect().width).toBeCloseTo(320, 0);
	});

	it('keeps appended controls outside the row action', async () => {
		await render(ListHarness, {});
		const freeze = page.getByRole('button', { name: 'Freeze' }).element();
		expect(main('row').contains(freeze)).toBe(false);
		expect(item('row').contains(freeze)).toBe(true);
	});

	it('marks the active link as the current page', async () => {
		await render(ListHarness, { active: true });
		expect(main('link').getAttribute('aria-current')).toBe('page');
		expect(item('link').classList).toContain('sv-list-item--active');
	});

	it('disables rows: a button natively, a link by losing its href', async () => {
		const onopen = vi.fn();
		await render(ListHarness, { onopen, disabled: true });
		expect(main('button').hasAttribute('disabled')).toBe(true);
		main('button').click();
		expect(onopen).not.toHaveBeenCalled();
		expect(main('link').hasAttribute('href')).toBe(false);
		expect(main('link').getAttribute('aria-disabled')).toBe('true');
	});

	it('sets row heights by density', async () => {
		const screen = await render(ListHarness, {});
		const height = () => main('static').getBoundingClientRect().height;
		const tall = height();
		expect(tall).toBeGreaterThanOrEqual(2.618 * 16 - 0.5);
		await screen.rerender({ density: 'compact' });
		expect(height()).toBeLessThan(tall);
	});
});
