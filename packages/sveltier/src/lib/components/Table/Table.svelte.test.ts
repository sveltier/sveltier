import { describe, expect, it, vi } from 'vitest';
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
		const wash = (row: Element) => getComputedStyle(row.children[1]!).backgroundImage;
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

	it('keeps an extra-small dense row about 20px tall, the header too', async () => {
		// Text columns only: a row is as tall as its tallest cell, and a native button is taller.
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
			{ key: 'quantity', label: 'Quantity' }
		];
		await render(TableHarness, { columns, size: 'xs', density: 'dense' });
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		// A control of size xs (φ rem) times the dense density (φ^-½) is √φ rem.
		const expected = 1.272 * rem;
		const cell = table().element().querySelector('tbody td')!.getBoundingClientRect();
		const head = header('Symbol').element().getBoundingClientRect();
		expect(cell.height).toBeCloseTo(expected, 0);
		expect(head.height).toBeCloseTo(expected, 0);
	});
});

const PINNED: TableColumn<Position>[] = [
	{ key: 'symbol', label: 'Symbol', rowHeader: true, pinned: true },
	{ key: 'quantity', label: 'Quantity' },
	{ key: 'price', label: 'Price', format: (price) => price.toFixed(2) },
	{ id: 'value', label: 'Value', value: (p) => (p.price ?? 0) * p.quantity },
	{ key: 'status', label: 'Status' }
];

describe('Table pinned column', () => {
	const cell = (name: string) => page.getByRole('rowheader', { name }).element();
	const rect = (element: Element) => element.getBoundingClientRect();
	const at = (x: number, y: number) => document.elementFromPoint(x, y)?.closest('th, td');

	it('stays at the start of the box while the others scroll across under it, its header over all', async () => {
		await render(TableHarness, {
			columns: PINNED,
			style: 'inline-size: 12rem; max-block-size: 10rem',
			rowAttributes: (position: Position) => ({ 'aria-current': position.symbol === 'VNM' })
		});
		const scroller = box();
		await expect.poll(() => scroller.scrollWidth > scroller.clientWidth).toBe(true);
		expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
		const quantity = rect(header('Quantity').element()).left;
		scroller.scrollLeft = 80;
		const edge = rect(scroller).left;
		expect(rect(header('Quantity').element()).left).toBeLessThan(quantity - 40);
		expect(Math.abs(rect(header('Symbol').element()).left - edge)).toBeLessThan(1);
		const vnm = rect(cell('VNM'));
		expect(Math.abs(vnm.left - edge)).toBeLessThan(1);
		// The scrolled cells pass under the pinned ones.
		expect(at(edge + 4, vnm.top + vnm.height / 2)).toBe(cell('VNM'));
		// The caption's words stay in view as well.
		const words = rect(table().element().querySelector('caption > span')!);
		expect(words.left).toBeGreaterThan(edge);
		expect(words.right).toBeLessThan(rect(scroller).right);

		// Scrolled down too, the rows pass under the pinned header.
		scroller.scrollTop = scroller.scrollHeight;
		const head = rect(header('Symbol').element());
		expect(Math.abs(head.top - rect(scroller).top)).toBeLessThan(1);
		expect(at(edge + 4, head.top + head.height / 2)).toBe(header('Symbol').element());
		// On the surface, with its row's wash over it.
		const style = getComputedStyle(cell('VNM'));
		expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(style.backgroundImage).not.toBe('none');
	});

	it('stays at the right in a right-to-left table', async () => {
		await render(TableHarness, { columns: PINNED, style: 'inline-size: 12rem', dir: 'rtl' });
		const scroller = box();
		await expect.poll(() => scroller.scrollWidth > scroller.clientWidth).toBe(true);
		scroller.scrollLeft = -80;
		expect(Math.abs(rect(cell('VNM')).right - rect(scroller).right)).toBeLessThan(1);
	});

	it('draws its edge only while the table scrolls across, at the same width', async () => {
		const screen = await render(TableHarness, { columns: PINNED.slice(0, 2) });
		const edge = () => getComputedStyle(cell('VNM')).borderInlineEndColor;
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		expect(box().classList.contains('sv-table--across')).toBe(false);
		expect(edge()).toBe('rgba(0, 0, 0, 0)');
		const border = getComputedStyle(cell('VNM')).borderInlineEndWidth;
		expect(border).not.toBe('0px');
		await screen.rerender({ style: 'inline-size: 4rem' });
		await expect.poll(() => box().classList.contains('sv-table--across')).toBe(true);
		expect(edge()).not.toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(cell('VNM')).borderInlineEndWidth).toBe(border);
	});

	it('warns in development when more than one column is pinned', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const pinned = (text: string) =>
			warn.mock.calls.some(([message]) => String(message).includes(text));
		const one = await render(TableHarness, { columns: PINNED });
		await expect.element(table()).toBeVisible();
		expect(pinned('SV4010')).toBe(false);
		one.unmount();
		await render(TableHarness, {
			columns: PINNED.map((column, i) => (i === 1 ? { ...column, pinned: true } : column))
		});
		await expect
			.poll(() => pinned("SV4010] <Table> pins 2 columns: 'Symbol', 'Quantity'"))
			.toBe(true);
		warn.mockRestore();
	});
});
