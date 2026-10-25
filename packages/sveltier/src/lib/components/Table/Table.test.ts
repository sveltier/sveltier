import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TableHarness from '../../../tests/fixtures/TableHarness.svelte';
import { compareValues } from './sort.js';

// Runs in Node: the server sends the whole table, already sorted. Hydration markers are left out
// of the HTML the tests read.
const html = (props: Record<string, unknown> = {}) =>
	render(TableHarness, { props }).body.replace(/<!--.*?-->/g, '');
const symbols = (body: string) =>
	[...body.matchAll(/<th scope="row"[^>]*>(\w+)/g)].map((m) => m[1]);

describe('Table on the server', () => {
	it('renders the caption, the headers and a row per item', () => {
		const body = html();
		expect(body).toContain('<caption');
		expect(body).toContain('Positions</caption>');
		expect(body.match(/scope="col"/g)).toHaveLength(6);
		expect(symbols(body)).toEqual(['VNM', 'FPT', 'HPG', 'ACB']);
	});

	it('lines up numbers at the end and text at the start, unless a column says otherwise', () => {
		const body = html();
		const heads = [...body.matchAll(/<th scope="col" class="([^"]+)"/g)].map((m) => m[1] ?? '');
		expect(heads.map((c) => /--(start|center|end)/.exec(c)?.[1])).toEqual([
			'start',
			'end',
			'end',
			'end',
			'start',
			'start'
		]);
	});

	it('formats values, computes a column, renders snippets and shows a dash for a missing value', () => {
		const body = html();
		expect(body).toContain('61.20');
		expect(body).toContain('18360');
		expect(body).toContain('data-testid="status"');
		expect(body).toContain('Close VNM');
		expect(body).toMatch(/sv-table__cell--end"[^>]*>\s*—/);
	});

	it('hides the label of a column of buttons from sight only', () => {
		const body = html();
		expect(body).toContain('<span class="sv-visually-hidden">Actions</span>');
	});

	it('marks no column as sorted until one is', () => {
		expect(html()).not.toContain('aria-sort');
		const body = html({ sortBy: { column: 'quantity', direction: 'descending' } });
		expect(body.match(/aria-sort="descending"/g)).toHaveLength(1);
		expect(symbols(body)).toEqual(['FPT', 'ACB', 'VNM', 'HPG']);
	});

	it('puts missing values last in either direction', () => {
		for (const direction of ['ascending', 'descending'] as const) {
			const body = html({ sortBy: { column: 'price', direction } });
			expect(symbols(body).at(-1)).toBe('HPG');
		}
	});

	it('says there is no data, or what the empty snippet says', () => {
		expect(html({ items: [] })).toContain('No data');
		const body = html({ items: [], withEmpty: true });
		expect(body).toContain('No positions yet');
		expect(body).toContain('colspan="6"');
	});

	it('marks the table busy while loading, with "Loading" in place of the empty state', () => {
		const body = html({ items: [], loading: true });
		expect(body).toContain('aria-busy="true"');
		expect(body).toContain('sv-table__progress');
		expect(body).toContain('Loading');
		expect(body).not.toContain('No data');
	});

	it('is not a tab stop until the browser finds that it scrolls', () => {
		const body = html();
		expect(body).not.toContain('tabindex');
		expect(body).not.toContain('role="region"');
	});
});

describe('compareValues', () => {
	const collator = new Intl.Collator('en-US', { numeric: true });

	it('orders numbers and big integers by size, together', () => {
		expect([10, 2n, 3, -1].sort((a, b) => compareValues(a, b, collator))).toEqual([-1, 2n, 3, 10]);
	});

	it('orders dates by time and false before true', () => {
		const early = new Date('2026-01-01');
		const late = new Date('2026-06-01');
		expect(compareValues(late, early, collator)).toBeGreaterThan(0);
		expect(compareValues(false, true, collator)).toBeLessThan(0);
	});

	it('orders text with numbers in it as people read it', () => {
		expect(['Lot 10', 'lot 2', 'Lot 1'].sort((a, b) => compareValues(a, b, collator))).toEqual([
			'Lot 1',
			'lot 2',
			'Lot 10'
		]);
	});
});
