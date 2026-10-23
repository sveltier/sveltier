import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import VirtualHarness from '../../../tests/fixtures/VirtualHarness.svelte';
import { virtualList } from './virtual-list.svelte.js';

const viewport = () => page.getByTestId('viewport').element() as HTMLElement;
const rendered = () =>
	[...viewport().querySelectorAll<HTMLElement>('[data-index]')].map((item) =>
		Number(item.dataset.index)
	);
const range = (from: number, to: number) =>
	Array.from({ length: to - from + 1 }, (_, i) => from + i);
// Distance from the top of the viewport to the top of an item; NaN while it is not rendered.
const top = (index: number) => {
	const item = viewport().querySelector(`[data-index="${index}"]`);
	if (!item) return NaN;
	return item.getBoundingClientRect().top - viewport().getBoundingClientRect().top;
};
const frames = (count: number) =>
	new Promise<void>((resolve) => {
		const next = (left: number) =>
			left === 0 ? resolve() : requestAnimationFrame(() => next(left - 1));
		next(count);
	});

// Errors the page reports, such as ResizeObserver loop errors, which no test should cause.
const errors: string[] = [];
const collect = (event: ErrorEvent) => errors.push(event.message);
beforeEach(() => {
	errors.length = 0;
	window.addEventListener('error', collect);
});
afterEach(() => {
	window.removeEventListener('error', collect);
	expect(errors).toEqual([]);
});

describe('virtualList', () => {
	it('renders only the items in view and the overscan', async () => {
		const list = virtualList(() => ({ count: 10_000, itemSize: 20 }));
		await render(VirtualHarness, { list });
		// 200px holds items 0 to 9; three more below.
		expect(rendered()).toEqual(range(0, 12));
		expect(list.totalSize).toBe(200_000);
		expect(page.getByTestId('content').element().getBoundingClientRect().height).toBe(200_000);
	});

	it('follows the scroll position', async () => {
		const list = virtualList(() => ({ count: 10_000, itemSize: 20 }));
		await render(VirtualHarness, { list });
		viewport().scrollTop = 1000;
		await expect.poll(rendered).toEqual(range(47, 62));
		expect(top(50)).toBeCloseTo(0, 0);
		expect(viewport().style.overflowAnchor).toBe('none');
	});

	it('follows the item count', async () => {
		let count = $state(10_000);
		const list = virtualList(() => ({ count, itemSize: 20 }));
		await render(VirtualHarness, { list });
		count = 5;
		flushSync();
		expect(rendered()).toEqual(range(0, 4));
		expect(list.totalSize).toBe(100);
		count = 0;
		flushSync();
		expect(rendered()).toEqual([]);
		expect(list.totalSize).toBe(0);
	});

	it('renders the rows in view when the content shrinks while scrolled', async () => {
		let count = $state(10_000);
		const list = virtualList(() => ({ count, itemSize: 20 }));
		await render(VirtualHarness, { list });
		viewport().scrollTop = 100_000;
		await expect.poll(rendered).toContain(5000);
		count = 20;
		flushSync();
		// The browser clamps the scroll position to 200, where rows 10 to 19 show. They are
		// rendered before the scroll event that reports it.
		expect(rendered()).toEqual(range(7, 19));
	});
});

describe('scrollToIndex', () => {
	it('scrolls an item into view and renders it at once', async () => {
		const list = virtualList(() => ({ count: 10_000, itemSize: 20 }));
		await render(VirtualHarness, { list });
		list.scrollToIndex(5);
		expect(viewport().scrollTop).toBe(0);
		list.scrollToIndex(100);
		expect(viewport().scrollTop).toBe(1820);
		list.scrollToIndex(50);
		expect(viewport().scrollTop).toBe(1000);
		list.scrollToIndex(5000, { align: 'center' });
		expect(viewport().scrollTop).toBe(99_910);
		// Rendered before the scroll event: it can be an active descendant right away.
		flushSync();
		expect(rendered()).toContain(5000);
		list.scrollToIndex(20, { align: 'end' });
		expect(viewport().scrollTop).toBe(220);
		list.scrollToIndex(9999, { align: 'start' });
		expect(viewport().scrollTop).toBe(199_800);
	});

	it('ignores indexes outside the list', async () => {
		const list = virtualList(() => ({ count: 100, itemSize: 20 }));
		await render(VirtualHarness, { list });
		list.scrollToIndex(50, { align: 'start' });
		list.scrollToIndex(-1);
		list.scrollToIndex(100);
		list.scrollToIndex(Number.NaN);
		expect(viewport().scrollTop).toBe(1000);
	});

	it('waits for the viewport when asked before it exists', async () => {
		const list = virtualList(() => ({ count: 10_000, itemSize: 20 }));
		list.scrollToIndex(5000, { align: 'start' });
		await render(VirtualHarness, { list });
		await expect.poll(() => viewport().scrollTop).toBe(100_000);
		expect(rendered()).toContain(5000);
	});

	it('reaches rows added in the same update', async () => {
		let count = $state(10);
		const list = virtualList(() => ({ count, itemSize: 20 }));
		await render(VirtualHarness, { list });
		count = 1000;
		list.scrollToIndex(999, { align: 'end' });
		await expect.poll(() => viewport().scrollTop).toBe(19_800);
		expect(rendered()).toContain(999);
	});

	it('lands on target once the rows around it are measured', async () => {
		const heights = (index: number) => 20 + (index % 7) * 5;
		const list = virtualList(() => ({ count: 10_000, itemSize: 30 }));
		await render(VirtualHarness, { list, heights });
		// Nothing is measured yet: the jump starts from estimates and corrects itself.
		list.scrollToIndex(5000, { align: 'center' });
		await expect.poll(() => Math.abs(top(5000) + heights(5000) / 2 - 100)).toBeLessThan(1);
	});

	it('does not make the calling effect re-run or fight the user', async () => {
		const heights = (index: number) => (index % 3 ? 20 : 40);
		const list = virtualList(() => ({ count: 10_000, itemSize: 25 }));
		await render(VirtualHarness, { list, heights });
		let active = $state(30);
		let runs = 0;
		const stop = $effect.root(() => {
			$effect(() => {
				runs++;
				list.scrollToIndex(active);
			});
		});
		flushSync();
		await frames(3);
		viewport().scrollTop = 100_000;
		await frames(6);
		expect(runs).toBe(1);
		expect(viewport().scrollTop).toBeGreaterThan(99_000);
		active = 31;
		flushSync();
		expect(runs).toBe(2);
		stop();
	});
});

describe('measured items', () => {
	it('measures items whose height is known only after layout', async () => {
		const heights = (index: number) => (index % 2 ? 40 : 20);
		const list = virtualList(() => ({ count: 1000, itemSize: 20 }));
		await render(VirtualHarness, { list, heights });
		await expect.poll(() => list.items[4]?.start).toBe(120);
		// Items 0 to 12 were rendered and measured; the rest keep the estimate.
		expect(list.totalSize).toBe(380 + 987 * 20);
		// 200px now holds items 0 to 6.
		await expect.poll(rendered).toEqual(range(0, 9));
		expect(top(6)).toBeCloseTo(180, 0);
	});

	it('measures the border box, so padding counts and a change to it alone is seen', async () => {
		const list = virtualList(() => ({ count: 100, itemSize: 20 }));
		const screen = await render(VirtualHarness, { list, padding: 4 });
		await expect.poll(() => list.items[2]?.start).toBe(56);
		await screen.rerender({ padding: 10 });
		await expect.poll(() => list.items[2]?.start).toBe(80);
	});

	it('keeps the content in view still when an item above it changes height', async () => {
		let tall = $state(false);
		const heights = (index: number) => (index === 48 && tall ? 60 : 20);
		const list = virtualList(() => ({ count: 1000, itemSize: 20 }));
		await render(VirtualHarness, { list, heights });
		viewport().scrollTop = 1000;
		await expect.poll(rendered).toContain(48);
		await frames(2);
		tall = true;
		await expect.poll(() => viewport().scrollTop).toBe(1040);
		expect(top(50)).toBeCloseTo(0, 0);
	});

	it('keeps the row being read still while scrolling up through unmeasured rows', async () => {
		const heights = (index: number) => 20 + (index % 5) * 10;
		const list = virtualList(() => ({ count: 10_000, itemSize: 30 }));
		await render(VirtualHarness, { list, heights });
		list.scrollToIndex(5000, { align: 'start' });
		await expect.poll(() => top(5000)).toBeCloseTo(0, 0);
		await frames(3);
		for (let step = 1; step <= 5; step++) {
			viewport().scrollTop -= 40;
			await frames(3);
			expect(top(5000)).toBeCloseTo(40 * step, 0);
		}
	});

	it('keeps its place when hidden and shown again', async () => {
		const heights = (index: number) => (index % 2 ? 40 : 20);
		const list = virtualList(() => ({ count: 10_000, itemSize: 20 }));
		const screen = await render(VirtualHarness, { list, heights });
		list.scrollToIndex(3000, { align: 'start' });
		await expect.poll(() => top(3000)).toBeCloseTo(0, 0);
		await frames(3);
		const size = list.totalSize;
		await screen.rerender({ hidden: true });
		await frames(3);
		await screen.rerender({ hidden: false });
		await expect.poll(() => top(3000)).toBeCloseTo(0, 0);
		expect(list.totalSize).toBe(size);
	});

	it('keeps measured heights with their items when items move', async () => {
		let keys = $state(['a', 'b', 'c']);
		const heights = (index: number) => (keys[index] === 'b' ? 60 : 20);
		const list = virtualList(() => ({
			count: keys.length,
			itemSize: 20,
			key: (index) => keys[index]!
		}));
		await render(VirtualHarness, { list, heights });
		await expect.poll(() => list.items.map((item) => item.size)).toEqual([20, 60, 20]);
		keys = ['z', ...keys];
		flushSync();
		expect(list.items.map((item) => `${item.key} ${item.start} ${item.size}`)).toEqual([
			'z 0 20',
			'a 20 20',
			'b 40 60',
			'c 100 20'
		]);
	});

	it('mounts the rows that measuring uncovers without a ResizeObserver loop error', async () => {
		// Rows far shorter than the estimate: measuring them brings six more rows into view.
		const list = virtualList(() => ({ count: 1000, itemSize: 50 }));
		await render(VirtualHarness, { list, heights: () => 20 });
		await expect.poll(rendered).toEqual(range(0, 12));
		for (let step = 0; step < 5; step++) {
			viewport().scrollTop += 150;
			await frames(2);
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		// The errors collected during the test are checked after it.
		expect(rendered()).toContain(50);
	});
});
