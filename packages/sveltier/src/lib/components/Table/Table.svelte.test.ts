import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { firstFrame, scripted, twoFrames } from '../../../tests/animations.js';
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
	[...table().element().querySelectorAll('tbody th[scope="row"]')].map((th) =>
		th.textContent?.trim()
	);
const px = (value: string) => Number.parseFloat(value);
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

describe('Table rows', () => {
	it('slide to their new places when a header sorts them', async () => {
		await render(TableHarness, {});
		await sortButton('Symbol').click();
		// VNM was first; sorted by symbol it is last, so it starts above its new place.
		const vnm = page.getByRole('row', { name: /VNM/ }).element();
		const frame = await firstFrame(vnm);
		const [, , y] = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(String(frame.transform))!;
		expect(Number(y)).toBeLessThan(0);
	});

	it('jump when there are more than 89', async () => {
		const items: Position[] = Array.from({ length: 90 }, (_, i) => ({
			...POSITIONS[i % POSITIONS.length]!,
			symbol: `S${String(i).padStart(2, '0')}`
		}));
		await render(TableHarness, { items, itemKey: 'symbol' });
		await sortButton('Quantity').click();
		await expect.element(page.getByTestId('sort')).toHaveTextContent('quantity ascending');
		await twoFrames();
		expect(scripted()).toHaveLength(0);
	});
});

describe('Table stack', () => {
	const rect = (element: Element) => element.getBoundingClientRect();
	const row = (symbol: string) => page.getByRole('row', { name: new RegExp(symbol) }).element();
	const cell = (symbol: string, index: number) => row(symbol).children[index] as HTMLElement;
	const label = (element: Element) => element.querySelector('.sv-table__label') as HTMLElement;

	it('shows each row as a block on a box narrower than its width, and a table on a wider one', async () => {
		const screen = await render(TableHarness, {
			stack: 'sm',
			stacks: { Value: 'primary' },
			style: 'inline-size: 360px'
		});
		const fpt = row('FPT');
		expect(getComputedStyle(fpt).display).toBe('grid');
		const [symbol, quantity, , value] = [0, 1, 2, 3].map((i) => cell('FPT', i));
		// The name and the primary figure share the first line, the figure at the end.
		expect(rect(value!).top).toBeCloseTo(rect(symbol!).top, 0);
		expect(rect(value!).right).toBeCloseTo(
			rect(fpt).right - px(getComputedStyle(fpt).paddingRight),
			0
		);
		expect(label(value!)).toBeNull();
		// Every other column follows on its own line, its label at the start, its value at the end.
		expect(rect(quantity!).top).toBeGreaterThanOrEqual(rect(symbol!).bottom - 1);
		expect(label(quantity!).textContent).toBe('Quantity');
		expect(getComputedStyle(label(quantity!)).display).toBe('block');
		const figure = quantity!.querySelector('.sv-table__value')!;
		expect(rect(figure).right).toBeCloseTo(rect(quantity!).right, 0);
		expect(rect(label(quantity!)).left).toBeCloseTo(rect(quantity!).left, 0);

		const [width, height] = [window.innerWidth, window.innerHeight];
		await page.viewport(800, height);
		await screen.rerender({
			stack: 'sm',
			stacks: { Value: 'primary' },
			style: 'inline-size: 640px'
		});
		await expect.poll(() => getComputedStyle(row('FPT')).display).toBe('table-row');
		expect(getComputedStyle(label(cell('FPT', 1))).display).toBe('none');
		await page.viewport(width, height);
	});

	it('puts two primary figures side by side on the first line', async () => {
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol', rowHeader: true },
			{ key: 'quantity', label: 'Quantity', stack: 'primary' },
			{ key: 'price', label: 'Price', stack: 'primary', format: (price) => price.toFixed(2) },
			{ key: 'status', label: 'Status' }
		];
		await render(TableHarness, { stack: 'sm', columns, style: 'inline-size: 360px' });
		const [symbol, quantity, price, status] = [0, 1, 2, 3].map((i) => cell('FPT', i)!);
		expect(rect(quantity!).top).toBeCloseTo(rect(symbol!).top, 0);
		expect(rect(price!).top).toBeCloseTo(rect(symbol!).top, 0);
		expect(rect(price!).left).toBeGreaterThan(rect(quantity!).right);
		expect(rect(status!).top).toBeGreaterThanOrEqual(rect(symbol!).bottom - 1);
		expect(rect(status!).width).toBeCloseTo(
			rect(row('FPT')).width - 2 * px(getComputedStyle(row('FPT')).paddingLeft),
			0
		);
	});

	it('puts a secondary column under the name without its label, and leaves out a hidden one', async () => {
		await render(TableHarness, {
			stack: 'sm',
			stacks: { Value: 'primary', Status: 'secondary', Price: 'hidden' },
			style: 'inline-size: 360px'
		});
		const [symbol, quantity, price, , status] = [0, 1, 2, 3, 4].map((i) => cell('FPT', i)!);
		expect(rect(status!).top).toBeGreaterThanOrEqual(rect(symbol!).bottom - 1);
		expect(rect(status!).left).toBeCloseTo(rect(symbol!).left, 0);
		// Across the block, under the primary figures too.
		expect(rect(status!).right).toBeCloseTo(rect(cell('FPT', 3)!).right, 0);
		expect(rect(quantity!).top).toBeGreaterThanOrEqual(rect(status!).bottom - 1);
		expect(label(status!)).toBeNull();
		// Out of sight, still a cell of the table.
		expect(rect(price!).width).toBeLessThanOrEqual(1);
		expect(page.getByRole('cell', { name: '118.50' }).all()).toHaveLength(1);
	});

	it('leaves out the line of a cell that shows nothing, and starts a long value at the line start', async () => {
		const long = 'Joint Stock Commercial Bank for Investment and Development of Vietnam';
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol', rowHeader: true },
			{ id: 'company', label: 'Company', value: () => long },
			{ key: 'quantity', label: 'Quantity' }
		];
		const screen = await render(TableHarness, {
			stack: 'sm',
			columns,
			style: 'inline-size: 360px'
		});
		const company = cell('VNM', 1);
		const value = company.querySelector('.sv-table__value')!;
		expect(rect(value).left).toBeCloseTo(rect(company).left, 0);
		expect(rect(value).height).toBeGreaterThan(rect(label(company)).height * 1.5);
		// A short value still sits at the end of its label's line.
		const quantity = cell('VNM', 2).querySelector('.sv-table__value')!;
		expect(rect(quantity).right).toBeCloseTo(rect(cell('VNM', 2)).right, 0);
		screen.unmount();

		await render(TableHarness, { stack: 'sm', blankClosed: true, style: 'inline-size: 360px' });
		expect(getComputedStyle(cell('HPG', 4)).display).toBe('none');
		expect(getComputedStyle(cell('VNM', 4)).display).toBe('flex');
	});

	it("warns that a column's primary is now stack: 'primary'", async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(TableHarness, {
			stack: 'sm',
			columns: [{ key: 'symbol', label: 'Symbol', rowHeader: true, primary: true as never }]
		});
		await expect
			.poll(() =>
				warn.mock.calls.some(([text]) => /SV4008.*stack: 'primary'.*primary/.test(String(text)))
			)
			.toBe(true);
		warn.mockRestore();
	});

	it('keeps the roles of a table, and the header names the cells', async () => {
		await render(TableHarness, { stack: 'md', style: 'inline-size: 360px' });
		await expect.element(table()).toBeVisible();
		expect(page.getByRole('row').all()).toHaveLength(POSITIONS.length + 1);
		await expect.element(page.getByRole('rowheader', { name: 'VNM' })).toBeVisible();
		expect(page.getByRole('columnheader').all()).toHaveLength(6);
		expect(page.getByRole('cell', { name: '1200' }).all()).toHaveLength(1);
		// The label shown beside a value is for the eye only.
		expect(label(cell('VNM', 1)).getAttribute('aria-hidden')).toBe('true');
	});

	it('sorts by a row of buttons, the other headers left to screen readers', async () => {
		await render(TableHarness, { stack: 'lg', style: 'inline-size: 360px' });
		const quantity = sortButton('Quantity').element();
		expect(rect(quantity).width).toBeGreaterThan(40);
		expect(rect(header('Status').element()).width).toBeLessThanOrEqual(1);
		await sortButton('Quantity').click();
		await expect.element(header('Quantity')).toHaveAttribute('aria-sort', 'ascending');
		expect(symbols()).toEqual(['HPG', 'VNM', 'ACB', 'FPT']);
	});

	it('marks the current row as a whole block', async () => {
		await render(TableHarness, {
			stack: 'sm',
			style: 'inline-size: 360px',
			rowAttributes: (item) => ({ 'aria-current': item.symbol === 'FPT' ? 'true' : undefined })
		});
		const fpt = getComputedStyle(row('FPT'));
		expect(fpt.backgroundImage).toContain('gradient');
		expect(fpt.boxShadow).toMatch(/inset/);
		expect(getComputedStyle(cell('FPT', 0)).backgroundImage).toBe('none');
	});

	it('warns about a stack width it does not know', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(TableHarness, { stack: 'xl' as never });
		await expect
			.poll(() =>
				warn.mock.calls.some(([text]) => /SV2002.*stack.*'sm' \| 'md' \| 'lg'/.test(String(text)))
			)
			.toBe(true);
		warn.mockRestore();
	});
});

describe('Table row press', () => {
	const row = (symbol: string) => page.getByRole('row', { name: new RegExp(symbol) }).element();
	const cell = (symbol: string, index: number) => row(symbol).children[index] as HTMLElement;
	const href = (item: Position) =>
		item.status === 'open' ? `#/positions/${item.symbol}` : undefined;

	/** Records the links a click lands on, and keeps the page where it is. */
	const followed = () => {
		const links: string[] = [];
		const record = (event: MouseEvent) => {
			const link = (event.target as Element).closest('a[href]');
			if (!link) return;
			event.preventDefault();
			links.push(link.getAttribute('href')!);
		};
		document.addEventListener('click', record);
		return { links, stop: () => document.removeEventListener('click', record) };
	};

	it("makes the row's name its link, followed by a press anywhere on the row", async () => {
		const clicks = followed();
		try {
			await render(TableHarness, { rowHref: href });
			const link = page.getByRole('link', { name: 'FPT' });
			await expect.element(link).toHaveAttribute('href', '#/positions/FPT');
			expect(link.element().closest('th')).toBe(cell('FPT', 0));
			cell('FPT', 1).click();
			expect(clicks.links).toEqual(['#/positions/FPT']);
			expect(getComputedStyle(row('FPT')).cursor).toBe('pointer');
		} finally {
			clicks.stop();
		}
	});

	it('opens the link in a new tab for a press with Ctrl, Cmd or the middle button', async () => {
		const clicks = followed();
		const open = vi.spyOn(window, 'open').mockReturnValue(null);
		try {
			await render(TableHarness, { rowHref: href });
			await userEvent.click(cell('VNM', 3), { modifiers: ['Control'] });
			await userEvent.click(cell('FPT', 1), { modifiers: ['Meta'] });
			cell('ACB', 2).dispatchEvent(new MouseEvent('auxclick', { bubbles: true, button: 1 }));
			const tab = (symbol: string) => [
				new URL(`#/positions/${symbol}`, location.href).href,
				'_blank',
				'noopener'
			];
			expect(open.mock.calls).toEqual([tab('VNM'), tab('FPT'), tab('ACB')]);
			// The page stays where it is.
			expect(clicks.links).toEqual([]);
		} finally {
			open.mockRestore();
			clicks.stop();
		}
	});

	it("leaves a row without a link alone, and the controls of a row's cells to themselves", async () => {
		const clicks = followed();
		try {
			await render(TableHarness, { rowHref: href });
			expect(page.getByRole('link', { name: 'HPG' }).elements()).toHaveLength(0);
			expect(getComputedStyle(row('HPG')).cursor).not.toBe('pointer');
			cell('HPG', 1).click();
			await page.getByRole('button', { name: 'Close FPT' }).click();
			expect(clicks.links).toEqual([]);
		} finally {
			clicks.stop();
		}
	});

	it('does not follow the link at the end of a text selection', async () => {
		const clicks = followed();
		try {
			await render(TableHarness, { rowHref: href });
			getSelection()!.selectAllChildren(cell('FPT', 1));
			cell('FPT', 1).click();
			expect(clicks.links).toEqual([]);
			getSelection()!.removeAllRanges();
		} finally {
			clicks.stop();
		}
	});

	it("makes the row's name a button with onrowclick, pressed from the row or the keyboard", async () => {
		const pressed = vi.fn();
		await render(TableHarness, { onrowclick: (item: Position) => pressed(item.symbol) });
		cell('ACB', 2).click();
		expect(pressed).toHaveBeenLastCalledWith('ACB');
		(page.getByRole('button', { name: 'VNM', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		expect(pressed).toHaveBeenLastCalledWith('VNM');
		await page.getByRole('button', { name: 'Close FPT' }).click();
		expect(pressed).toHaveBeenCalledTimes(2);
	});

	it('names a row by its first column when no column heads it', async () => {
		const columns: TableColumn<Position>[] = [
			{ key: 'symbol', label: 'Symbol' },
			{ key: 'quantity', label: 'Quantity' }
		];
		await render(TableHarness, { columns, rowHref: href });
		expect(page.getByRole('link', { name: 'ACB' }).element().closest('td')).toBe(cell('ACB', 0));
	});

	it('makes a whole block of a stacked table the link, washed under the pointer', async () => {
		const clicks = followed();
		try {
			await render(TableHarness, {
				rowHref: href,
				stack: 'sm',
				style: 'inline-size: 360px'
			});
			const label = cell('FPT', 2).querySelector('.sv-table__label') as HTMLElement;
			label.click();
			expect(clicks.links).toEqual(['#/positions/FPT']);
			await userEvent.hover(cell('ACB', 1));
			await expect.poll(() => getComputedStyle(row('ACB')).backgroundImage).toContain('gradient');
		} finally {
			clicks.stop();
		}
	});
});
