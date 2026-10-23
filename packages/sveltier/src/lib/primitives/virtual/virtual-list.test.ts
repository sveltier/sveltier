import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import VirtualHarness from '../../../tests/fixtures/VirtualHarness.svelte';
import { virtualList } from './virtual-list.svelte.js';

const indexes = (body: string) =>
	[...body.matchAll(/data-index="(\d+)"/g)].map((match) => Number(match[1]));

// Runs in Node: what the server renders before the viewport can be measured.
describe('virtualList on the server', () => {
	it('renders the overscan when it knows no viewport height', () => {
		const list = virtualList(() => ({ count: 1000, itemSize: 20 }));
		const { body } = render(VirtualHarness, { props: { list } });
		expect(indexes(body)).toEqual([0, 1, 2, 3]);
		expect(body).toContain('block-size: 20000px');
	});

	it('fills the height it is told to assume', () => {
		const list = virtualList(() => ({ count: 1000, itemSize: 20, ssrHeight: 100 }));
		const { body } = render(VirtualHarness, { props: { list } });
		expect(indexes(body)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
	});

	it('places items from an estimate per index', () => {
		const list = virtualList(() => ({
			count: 4,
			itemSize: (index) => 10 * (index + 1),
			ssrHeight: 1000
		}));
		expect(list.items.map(({ start, size, end }) => [start, size, end])).toEqual([
			[0, 10, 10],
			[10, 20, 30],
			[30, 30, 60],
			[60, 40, 100]
		]);
		expect(list.totalSize).toBe(100);
	});

	it('renders nothing for an empty list', () => {
		const list = virtualList(() => ({ count: 0, itemSize: 20, ssrHeight: 100 }));
		expect(list.items).toEqual([]);
		expect(list.totalSize).toBe(0);
	});

	it('treats a count that is not a number as an empty list', () => {
		const list = virtualList(() => ({ count: Number.NaN, itemSize: 20, ssrHeight: 100 }));
		expect(list.items).toEqual([]);
		expect(list.totalSize).toBe(0);
	});

	it('renders whole items for a fractional overscan', () => {
		const list = virtualList(() => ({ count: 100, itemSize: 20, overscan: 1.5 }));
		expect(list.items.map((item) => item.index)).toEqual([0, 1]);
	});

	it('says what to fix when the item size cannot work', () => {
		const list = virtualList(() => ({ count: 4, itemSize: 0 }));
		expect(() => list.items).toThrow(
			'[sveltier] virtualList: itemSize must be a positive number of px.'
		);
		const estimated = virtualList(() => ({ count: 4, itemSize: () => Number.NaN }));
		expect(() => estimated.items).toThrow(
			'[sveltier] virtualList: itemSize must return a positive number of px.'
		);
	});
});
