import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TableHarness, {
	POSITIONS,
	type Position
} from '../../../tests/fixtures/TableHarness.svelte';
import type { TableColumn } from './types.js';

const table = () => page.getByRole('table', { name: 'Positions' });
const box = () => page.getByTestId('table').element() as HTMLElement;
const header = (name: string) => page.getByRole('columnheader', { name });
const sortButton = (name: string) => page.getByRole('button', { name, exact: true });
const symbols = () =>
	[...table().element().querySelectorAll('tbody th[scope="row"]')].map((th) => th.textContent);
const text = (testId: string) => page.getByTestId(testId).element().textContent?.trim();

describe('Table', () => {
	it('sorts by a header: ascending, descending, then back to the order of the items', async () => {
		await render(TableHarness, {});
		await sortButton('Quantity').click();
		await expect.element(header('Quantity')).toHaveAttribute('aria-sort', 'ascending');
		expect(symbols()).toEqual(['HPG', 'VNM', 'ACB', 'FPT']);
		await sortButton('Quantity').click();
		await expect.element(header('Quantity')).toHaveAttribute('aria-sort', 'descending');
		expect(symbols()).toEqual(['FPT', 'ACB', 'VNM', 'HPG']);
		await sortButton('Quantity').click();
		await expect.element(header('Quantity')).not.toHaveAttribute('aria-sort');
		expect(symbols()).toEqual(['VNM', 'FPT', 'HPG', 'ACB']);
		expect(text('sort')).toBe('none');
		expect(text('reported')).toBe('quantity ascending, quantity descending, none');
	});

	it('moves the sort to another column, which starts ascending', async () => {
		await render(TableHarness, { sortBy: { column: 'quantity', direction: 'descending' } });
		await sortButton('Symbol').click();
		await expect.element(header('Symbol')).toHaveAttribute('aria-sort', 'ascending');
		await expect.element(header('Quantity')).not.toHaveAttribute('aria-sort');
		expect(symbols()).toEqual(['ACB', 'FPT', 'HPG', 'VNM']);
		expect(text('sort')).toBe('symbol ascending');
	});

	it('sorts from the keyboard, through the header buttons', async () => {
		await render(TableHarness, {});
		(sortButton('Value').element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.element(header('Value')).toHaveAttribute('aria-sort', 'ascending');
		expect(symbols()).toEqual(['HPG', 'VNM', 'ACB', 'FPT']);
		await userEvent.keyboard(' ');
		await expect.element(header('Value')).toHaveAttribute('aria-sort', 'descending');
	});

	it('sorts with a column comparator', async () => {
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol', rowHeader: true },
			{
				key: 'status',
				label: 'Status',
				sort: (a, b) => Number(a.status === 'open') - Number(b.status === 'open')
			}
		];
		await render(TableHarness, { columns });
		await sortButton('Status').click();
		expect(symbols()[0]).toBe('HPG');
	});

	it('keeps the sort as live items change, and keeps the rows of keyed items', async () => {
		const { rerender } = await render(TableHarness, {
			itemKey: 'symbol',
			sortBy: { column: 'quantity', direction: 'descending' }
		});
		const row = table().element().querySelector('tbody tr');
		await rerender({ items: POSITIONS.map((position) => ({ ...position })) });
		expect(table().element().querySelector('tbody tr')).toBe(row);
		await rerender({
			items: POSITIONS.map((p) => ({ ...p, quantity: p.symbol === 'HPG' ? 5000 : p.quantity }))
		});
		expect(symbols()).toEqual(['HPG', 'FPT', 'ACB', 'VNM']);
	});

	it('keeps the alignment it read while the table is empty for a moment', async () => {
		const { rerender } = await render(TableHarness, {});
		await expect.element(header('Quantity')).toHaveClass('sv-table__cell--end');
		await rerender({ items: [], loading: true });
		await expect.element(header('Quantity')).toHaveClass('sv-table__cell--end');
	});

	it('marks the current row from rowAttributes', async () => {
		await render(TableHarness, {
			rowAttributes: (position: Position) => ({ 'aria-current': position.symbol === 'FPT' })
		});
		const rows = table().element().querySelectorAll('tbody tr');
		expect(rows[1]!.getAttribute('aria-current')).toBe('true');
		const wash = (row: Element) => getComputedStyle(row.children[1]!).backgroundColor;
		expect(wash(rows[1]!)).not.toBe(wash(rows[0]!));
	});

	it('becomes a region that the keyboard can scroll when it overflows its box', async () => {
		await render(TableHarness, { maxBlockSize: '5rem' });
		const region = page.getByRole('region', { name: 'Positions' });
		await expect.element(region).toHaveAttribute('tabindex', '0');
	});

	it('is no tab stop when it fits its box', async () => {
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol', rowHeader: true },
			{ key: 'quantity', label: 'Quantity' }
		];
		await render(TableHarness, { columns });
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		expect(box().hasAttribute('tabindex')).toBe(false);
		expect(box().hasAttribute('role')).toBe(false);
	});

	it('keeps the header at the top of the box while the rows scroll', async () => {
		await render(TableHarness, { maxBlockSize: '6rem' });
		const scroller = box();
		await expect.poll(() => scroller.scrollHeight > scroller.clientHeight).toBe(true);
		scroller.scrollTop = 40;
		const head = header('Symbol').element().getBoundingClientRect();
		expect(Math.abs(head.top - scroller.getBoundingClientRect().top)).toBeLessThan(1);
	});

	it('takes a smaller row with a smaller size and a compact density', async () => {
		await render(TableHarness, {});
		const height = () =>
			table().element().querySelector('tbody td')!.getBoundingClientRect().height;
		const regular = height();
		await render(TableHarness, { size: 'sm', density: 'compact' });
		const rows = page.getByRole('table', { name: 'Positions' }).all();
		const compact = rows.at(-1)!.element().querySelector('tbody td')!.getBoundingClientRect();
		expect(compact.height).toBeLessThan(regular);
	});
});
