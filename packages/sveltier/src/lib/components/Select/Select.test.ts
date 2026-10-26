import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import SelectHarness from '../../../tests/fixtures/SelectHarness.svelte';
import {
	fold,
	inGroupOrder,
	matchesQuery,
	moveBy,
	typeaheadIndex,
	type SelectItem
} from './options.js';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown> = {}) =>
	render(SelectHarness, { props }).body.replace(/<!--.*?-->/g, '');

const ITEMS: SelectItem<string>[] = [
	{ value: 'a', label: 'Apple', group: 'Fruit' },
	{ value: 'c', label: 'Carrot', group: 'Vegetable' },
	{ value: 'b', label: 'Banana', group: 'Fruit', disabled: true },
	{ value: 'av', label: 'Avocado', group: 'Fruit' },
	{ value: 'k', label: 'Kale', group: 'Vegetable' }
];

describe('Select on the server', () => {
	it('renders a labelled combobox with its placeholder, closed', () => {
		const body = html();
		expect(body).toMatch(/role="combobox"[^>]*aria-expanded="false"/);
		expect(body).toMatch(/aria-labelledby="[^"]+-label"/);
		expect(body).toContain('Choose a market');
		expect(body).not.toContain('role="listbox"');
	});

	it('shows the chosen label and submits the value through a hidden input', () => {
		const body = html({ value: 'eth-usdt' });
		expect(body).toContain('ETH/USDT');
		expect(body).toContain('<input type="hidden" name="market" value="eth-usdt"/>');
	});
});

describe('Select options', () => {
	it('gathers each group where it first appears', () => {
		expect(inGroupOrder(ITEMS).map((item) => item.value)).toEqual(['a', 'b', 'av', 'c', 'k']);
	});

	it('moves past disabled items and stops at the ends', () => {
		const ordered = inGroupOrder(ITEMS);
		expect(moveBy(ordered, 0, 1)).toBe(2);
		expect(moveBy(ordered, 2, -1)).toBe(0);
		expect(moveBy(ordered, 4, 1)).toBe(4);
		expect(moveBy(ordered, 0, 10)).toBe(4);
		expect(moveBy(ordered, -1, 1)).toBe(0);
	});

	it('jumps to a label as typed, cycling through one letter and skipping disabled items', () => {
		const ordered = inGroupOrder(ITEMS);
		expect(typeaheadIndex(ordered, 'a', -1)).toBe(0);
		expect(typeaheadIndex(ordered, 'a', 0)).toBe(2);
		expect(typeaheadIndex(ordered, 'aa', 2)).toBe(0);
		expect(typeaheadIndex(ordered, 'av', 0)).toBe(2);
		expect(typeaheadIndex(ordered, 'b', 0)).toBe(-1);
	});

	it('matches a query without case or diacritics, every word anywhere', () => {
		expect(fold('Hà Nội Đông')).toBe('ha noi dong');
		const city = { value: 'hn', label: 'Hà Nội', description: 'Thủ đô' };
		expect(matchesQuery(city, 'ha noi')).toBe(true);
		expect(matchesQuery(city, 'thu do')).toBe(true);
		expect(matchesQuery(city, 'noi ha')).toBe(true);
		expect(matchesQuery(city, 'hue')).toBe(false);
		expect(matchesQuery({ value: 'x', label: 'BTCUSDT' }, 'usdt')).toBe(true);
		expect(matchesQuery(city, '  ')).toBe(true);
	});
});
