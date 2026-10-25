import { describe, expect, it } from 'vitest';
import { pageEntries } from './pages.js';

describe('pageEntries', () => {
	it('shows every page when they fit', () => {
		expect(pageEntries(1, 1, 1, 1)).toEqual([1]);
		expect(pageEntries(2, 2, 1, 1)).toEqual([1, 2]);
		expect(pageEntries(3, 5, 1, 1)).toEqual([1, 2, 3, 4, 5]);
		expect(pageEntries(1, 7, 1, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it('keeps the ends and the neighbours, with gaps between', () => {
		expect(pageEntries(1, 10, 1, 1)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
		expect(pageEntries(5, 10, 1, 1)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
		expect(pageEntries(10, 10, 1, 1)).toEqual([1, 'gap', 6, 7, 8, 9, 10]);
	});

	it('shows a number instead of a gap that would hide only that number', () => {
		expect(pageEntries(4, 10, 1, 1)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
		expect(pageEntries(7, 10, 1, 1)).toEqual([1, 'gap', 6, 7, 8, 9, 10]);
	});

	it('keeps as many entries wherever the page is', () => {
		const lengths = Array.from({ length: 20 }, (_, i) => pageEntries(i + 1, 20, 1, 1).length);
		expect(new Set(lengths)).toEqual(new Set([7]));
	});

	it('follows siblings and boundaries', () => {
		expect(pageEntries(10, 20, 2, 2)).toEqual([1, 2, 'gap', 8, 9, 10, 11, 12, 'gap', 19, 20]);
		expect(pageEntries(5, 10, 0, 1)).toEqual([1, 'gap', 5, 'gap', 10]);
		expect(pageEntries(5, 10, 1, 0)).toEqual(['gap', 4, 5, 6, 'gap']);
	});
});
