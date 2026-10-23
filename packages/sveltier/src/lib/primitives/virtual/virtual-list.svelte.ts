import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export type VirtualKey = string | number;

export interface VirtualListOptions {
	/** How many items the list has. */
	count: number;
	/**
	 * Item height in px: one number when every item is as tall, or an estimate per index.
	 * Items with the `measure` attachment are measured, and the measurement wins.
	 */
	itemSize: number | ((index: number) => number);
	/** Items rendered beyond each edge of the viewport. Defaults to 3. */
	overscan?: number;
	/**
	 * A stable key per item, so measured heights follow items that move. Defaults to the index.
	 * Once items are measured it is read for every item when sizes change: keep large data in
	 * `$state.raw`, not deep `$state`.
	 */
	key?: (index: number) => VirtualKey;
	/** Viewport height in px assumed until the viewport is measured, as on the server. Defaults to 0. */
	ssrHeight?: number;
}

export interface VirtualItem {
	readonly index: number;
	readonly key: VirtualKey;
	/** Distance from the top of the list to the item, in px. */
	readonly start: number;
	readonly size: number;
	/** `start + size`. */
	readonly end: number;
}

export interface ScrollToIndexOptions {
	/**
	 * Where the item lands. `auto` scrolls as little as possible, and not at all when the item
	 * is in view. Defaults to `'auto'`.
	 */
	align?: 'auto' | 'start' | 'center' | 'end';
}

/** A virtual list: which items to render for the scroll position, and where. Every field is reactive. */
export interface VirtualList {
	/** The items to render: those in view, plus the overscan. */
	readonly items: VirtualItem[];
	/** Height of all the items together in px: the height of the element that holds them. */
	readonly totalSize: number;
	/** For the scroll container. */
	readonly viewport: Attachment<HTMLElement>;
	/** For item elements, with `data-index={item.index}`, to measure their real height. */
	readonly measure: Attachment<HTMLElement>;
	/**
	 * Scrolls the viewport, at once, so the item is in view, and renders it in the same update.
	 * Indexes outside the list are ignored.
	 */
	scrollToIndex(index: number, options?: ScrollToIndexOptions): void;
}

// A scroll to an item. It waits for the viewport to exist and be shown, and stays aimed while
// the rows mounted around the target are measured.
interface Jump {
	index: number;
	align: NonNullable<ScrollToIndexOptions['align']>;
	/** Where it last scrolled to. */
	top?: number;
}

class Virtualizer implements VirtualList {
	readonly #options: () => VirtualListOptions;
	// The scroll position, and the viewport height once measured.
	#offset = $state(0);
	#height = $state<number>();
	// Measured heights by key, in a plain map: one signal for all of them, not one per item.
	readonly #sizes = new Map<VirtualKey, number>();
	#version = $state(0);
	#element: HTMLElement | undefined;
	#observer: ResizeObserver | undefined;
	// Items are observed from the next frame on: an observation added while ResizeObserver is
	// delivering (rows mounted because measured rows moved) is reported as a loop error.
	readonly #queued = new Set<HTMLElement>();
	#observing = 0;
	#jump: Jump | undefined;
	#expiry = 0;
	// The part of a scroll shift the browser rounded away, carried to the next one.
	#remainder = 0;

	constructor(options: () => VirtualListOptions) {
		this.#options = options;
	}

	#config = $derived.by(() => {
		const { count, itemSize, overscan = 3, key, ssrHeight = 0 } = this.#options();
		if (typeof itemSize === 'number' && !(itemSize > 0)) {
			throw new Error('[sveltier] virtualList: itemSize must be a positive number of px.');
		}
		return {
			count: Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0,
			itemSize,
			overscan: Math.max(0, Math.trunc(overscan)) || 0,
			key,
			ssrHeight: Math.max(0, ssrHeight) || 0
		};
	});

	// Where every item starts, plus the end of the last one. Not needed while all items are
	// one known height: then a start is a multiplication.
	#starts = $derived.by(() => {
		const { count, itemSize, key } = this.#config;
		const version = this.#version;
		if (version === 0 && typeof itemSize === 'number') return undefined;
		// Until something is measured there is nothing to look up, and no key to work out.
		const sizes = version > 0 ? this.#sizes : undefined;
		const starts = new Float64Array(count + 1);
		for (let i = 0; i < count; i++) {
			starts[i + 1] = starts[i]! + (sizes?.get(key ? key(i) : i) ?? this.#estimate(i));
		}
		return starts;
	});

	#estimate(index: number): number {
		const { itemSize } = this.#config;
		if (typeof itemSize === 'number') return itemSize;
		const size = itemSize(index);
		if (!(size > 0)) {
			throw new Error('[sveltier] virtualList: itemSize must return a positive number of px.');
		}
		return size;
	}

	#start(index: number): number {
		return this.#starts?.[index] ?? index * (this.#config.itemSize as number);
	}

	// The item at a distance from the top of the list, clamped to the list.
	#indexAt(offset: number): number {
		const { count, itemSize } = this.#config;
		const starts = this.#starts;
		let index: number;
		if (starts) {
			let low = 0;
			let high = count - 1;
			while (low < high) {
				const middle = (low + high + 1) >> 1;
				if (starts[middle]! <= offset) low = middle;
				else high = middle - 1;
			}
			index = low;
		} else {
			index = Math.floor(offset / (itemSize as number));
		}
		return Math.max(0, Math.min(count - 1, index));
	}

	#totalSize = $derived(this.#start(this.#config.count));
	#viewHeight = $derived(this.#height ?? this.#config.ssrHeight);

	// The scroll position, kept within the content: when the content shrinks, the browser clamps
	// the real position a frame before the scroll event reports it.
	#top = $derived(Math.max(0, Math.min(this.#offset, this.#totalSize - this.#viewHeight)));

	// First and last rendered index, as separate numbers: scrolling within the rendered range
	// changes neither, so nothing re-renders.
	#first = $derived(Math.max(0, this.#indexAt(this.#top) - this.#config.overscan));
	#last = $derived.by(() => {
		const { count, overscan } = this.#config;
		// The item holding the last visible pixel; one starting right at the bottom is not in view.
		const bottom = this.#top + this.#viewHeight;
		return Math.min(count - 1, this.#indexAt(Math.max(bottom - 0.001, 0)) + overscan);
	});

	#items = $derived.by(() => {
		const { count, key } = this.#config;
		const items: VirtualItem[] = [];
		if (count === 0) return items;
		for (let index = this.#first; index <= this.#last; index++) {
			const start = this.#start(index);
			const end = this.#start(index + 1);
			items.push({ index, key: key ? key(index) : index, start, size: end - start, end });
		}
		return items;
	});

	// Getters only: the rendered range is derived, never set.
	get items(): VirtualItem[] {
		return this.#items;
	}

	get totalSize(): number {
		return this.#totalSize;
	}

	viewport: Attachment<HTMLElement> = (element) => {
		this.#element = element;
		// Item heights are kept steady by the list itself; the browser's scroll anchoring would
		// correct for them a second time.
		const anchoring = element.style.overflowAnchor;
		element.style.overflowAnchor = 'none';
		const scrolled = () => {
			// A scroll that lands away from a pending jump is the user's: the jump gives way.
			const top = this.#jump?.top;
			if (top !== undefined && Math.abs(element.scrollTop - top) >= 1) this.#jump = undefined;
			this.#offset = element.scrollTop;
		};
		const resized = new ResizeObserver(() => {
			this.#height = element.clientHeight;
			if (element.clientHeight === 0) return;
			// Shown again: the browser restores the scroll position without a scroll event.
			this.#offset = element.scrollTop;
			this.#aim();
		});
		element.addEventListener('scroll', scrolled, { passive: true });
		resized.observe(element);
		this.#offset = element.scrollTop;
		this.#height = element.clientHeight;
		// A jump asked for before the viewport existed. Untracked: attachments re-run on what
		// they read.
		untrack(() => this.#aim());
		return () => {
			element.removeEventListener('scroll', scrolled);
			resized.disconnect();
			element.style.overflowAnchor = anchoring;
			if (this.#element === element) this.#element = undefined;
		};
	};

	measure: Attachment<HTMLElement> = (element) => {
		if (element.dataset.index === undefined) {
			throw new Error('[sveltier] virtualList: measured items need data-index={item.index}.');
		}
		this.#queued.add(element);
		if (!this.#observing) this.#observing = requestAnimationFrame(() => this.#observeQueued());
		return () => {
			this.#queued.delete(element);
			this.#observer?.unobserve(element);
		};
	};

	#observeQueued() {
		this.#observing = 0;
		// Border box: padding and borders count, and a change to them alone is reported.
		this.#observer ??= new ResizeObserver((entries) => this.#measured(entries));
		for (const element of this.#queued) this.#observer.observe(element, { box: 'border-box' });
		this.#queued.clear();
	}

	#measured(entries: ResizeObserverEntry[]) {
		const element = this.#element;
		// A hidden viewport reports every row as 0px: keep what was measured while it showed.
		if (element?.clientHeight === 0) return;
		const { count, key } = this.#config;
		const top = this.#top;
		let changed = false;
		let shift = 0;
		for (const entry of entries) {
			const index = Number((entry.target as HTMLElement).dataset.index);
			if (!(index >= 0 && index < count)) continue;
			const id = key ? key(index) : index;
			const size = entry.borderBoxSize[0]!.blockSize;
			const previous = this.#sizes.get(id) ?? this.#estimate(index);
			this.#sizes.set(id, size);
			if (size === previous) continue;
			changed = true;
			// An item above the scroll position pushes the content in view: follow it.
			if (this.#start(index) < top) shift += size - previous;
		}
		if (!changed) return;
		this.#version++;
		// A pending jump re-aims at its target, which accounts for every row that moved.
		if (this.#jump) this.#aim();
		else if (shift && element) this.#shift(element, shift);
	}

	#shift(element: HTMLElement, by: number) {
		const wanted = element.scrollTop + by + this.#remainder;
		element.scrollTop = wanted;
		const rest = wanted - element.scrollTop;
		this.#remainder = Math.abs(rest) < 1 ? rest : 0;
		this.#offset = element.scrollTop;
	}

	scrollToIndex(index: number, { align = 'auto' }: ScrollToIndexOptions = {}) {
		// Untracked, so an effect that calls this does not re-run on every measurement.
		untrack(() => {
			const target = Math.trunc(index);
			if (!(target >= 0 && target < this.#config.count)) return;
			this.#jump = { index: target, align };
			this.#aim();
		});
	}

	// Scrolls to the pending jump, once there is a viewport and it is shown.
	#aim() {
		const jump = this.#jump;
		const element = this.#element;
		if (!jump || !element || element.clientHeight === 0) return;
		if (jump.index >= this.#config.count) {
			this.#jump = undefined;
			return;
		}
		const view = element.clientHeight;
		const start = this.#start(jump.index);
		const end = this.#start(jump.index + 1);
		if (jump.align === 'auto') {
			const offset = element.scrollTop;
			if (start >= offset && end <= offset + view) {
				this.#jump = undefined;
				return;
			}
			// Settled once, so later passes keep the item at the same edge.
			jump.align = start < offset ? 'start' : 'end';
		}
		const wanted =
			jump.align === 'start' ? start : jump.align === 'end' ? end - view : (start + end - view) / 2;
		const top = Math.max(0, Math.min(wanted, this.#totalSize - view));
		jump.top = top;
		// Render the target now, not after the scroll event: it may be an active descendant.
		this.#offset = top;
		element.scrollTo({ top, behavior: 'instant' });
		// The content may not have grown yet to allow that scroll: again once Svelte has rendered.
		if (Math.abs(element.scrollTop - top) >= 1) {
			queueMicrotask(() => {
				if (this.#jump === jump) element.scrollTo({ top: jump.top, behavior: 'instant' });
			});
		}
		// Rows mounted around the target are measured within a frame; the jump ends a frame after
		// the last measurement that moved it.
		cancelAnimationFrame(this.#expiry);
		this.#expiry = requestAnimationFrame(() => {
			this.#expiry = requestAnimationFrame(() => {
				if (this.#jump !== jump) return;
				this.#jump = undefined;
				// In case the scroll never happened, as when nothing was tall enough to scroll. Not
				// while hidden: a hidden element reports a scroll position of 0.
				const current = this.#element;
				if (current && current.clientHeight > 0) this.#offset = current.scrollTop;
			});
		});
	}
}

/**
 * Renders only the items in view out of thousands. Options are read through a function, so
 * they stay reactive.
 *
 * @example
 * const list = virtualList(() => ({ count: rows.length, itemSize: 34 }));
 * // <div class="viewport" {@attach list.viewport}>
 * //   <div style:height="{list.totalSize}px" style:position="relative">
 * //     {#each list.items as item (item.key)}
 * //       <div class="row" style:transform="translateY({item.start}px)">…</div>
 */
export function virtualList(options: () => VirtualListOptions): VirtualList {
	return new Virtualizer(options);
}
