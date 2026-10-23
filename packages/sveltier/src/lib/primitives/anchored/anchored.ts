import type { Attachment } from 'svelte/attachments';

/** Side of the anchor. `start` and `end` follow the writing direction. */
export type Side = 'top' | 'bottom' | 'start' | 'end';
/** Alignment along that side, following the writing direction. */
export type Align = 'start' | 'center' | 'end';
export type PhysicalSide = 'top' | 'bottom' | 'left' | 'right';

export interface AnchoredOptions {
	/** The element to place against. Nothing happens until it exists. */
	anchor: Element | null | undefined;
	/** Defaults to `'bottom'`. */
	side?: Side;
	/** Defaults to `'start'`. */
	align?: Align;
	/** Gap between the anchor and the floating element, in px. Defaults to 5. */
	offset?: number;
	/** Move to the opposite side when there is not enough room. Defaults to `true`. */
	flip?: boolean;
}

/**
 * The physical side, and the alignment in physical terms (start is left or top), of a
 * logical placement in the element's direction. Both placement paths use it, so they agree.
 */
export function physical(side: Side, align: Align, rtl: boolean): [PhysicalSide, Align] {
	if (side === 'top' || side === 'bottom') {
		const mirrored: Align = align === 'start' ? 'end' : align === 'end' ? 'start' : align;
		return [side, rtl ? mirrored : align];
	}
	return [(side === 'end') !== rtl ? 'right' : 'left', align];
}

/** `position-area` in physical keywords: `bottom span-right` is below, from the left edge. */
export function positionArea(side: PhysicalSide, align: Align): string {
	if (align === 'center') return side;
	const vertical = side === 'top' || side === 'bottom';
	const span = vertical
		? align === 'start'
			? 'right'
			: 'left'
		: align === 'start'
			? 'bottom'
			: 'top';
	return `${side} span-${span}`;
}

// The margin that faces the anchor; flipping mirrors it to the other side.
const MARGIN: Record<PhysicalSide, string> = {
	top: 'margin-bottom',
	bottom: 'margin-top',
	left: 'margin-right',
	right: 'margin-left'
};

let names = 0;

/**
 * Whether the element sits in a part of the page whose direction differs from the root's.
 * Firefox (157) misplaces anchored elements there, so the script places them instead.
 */
function mixedDirection(element: HTMLElement): boolean {
	const root = getComputedStyle(document.documentElement).direction;
	return [element, element.parentElement].some(
		(node) => node && getComputedStyle(node).direction !== root
	);
}

/**
 * Places the element next to `anchor` and keeps it there on scroll and resize, flipping to
 * the opposite side when there is not enough room. Uses CSS anchor positioning where the
 * browser has it, otherwise loads a small script. The element must be positioned against the
 * viewport: a popover in the top layer, or `position: fixed`.
 *
 * @example
 * <button bind:this={trigger}>Account</button>
 * <div popover="manual" {@attach anchored({ anchor: trigger, side: 'bottom', align: 'end' })}>…</div>
 */
export function anchored({
	anchor,
	side = 'bottom',
	align = 'start',
	offset = 5,
	flip = true
}: AnchoredOptions): Attachment<HTMLElement> {
	return (floating) => {
		if (!anchor) return;

		const [physicalSide, physicalAlign] = physical(
			side,
			align,
			getComputedStyle(floating).direction === 'rtl'
		);

		if (!CSS.supports('position-try-fallbacks: flip-block') || mixedDirection(floating)) {
			let stop: (() => void) | undefined;
			let cancelled = false;
			const placement = { side: physicalSide, align: physicalAlign, offset, flip };
			void import('./fallback.js').then(({ follow }) => {
				if (!cancelled) stop = follow(anchor, floating, placement);
			});
			return () => {
				cancelled = true;
				stop?.();
			};
		}

		const name = `--sv-anchor-${++names}`;
		const anchorStyle = (anchor as HTMLElement | SVGElement).style;
		const existing = getComputedStyle(anchor).getPropertyValue('anchor-name');
		anchorStyle.setProperty(
			'anchor-name',
			existing && existing !== 'none' ? `${existing}, ${name}` : name
		);
		const vertical = physicalSide === 'top' || physicalSide === 'bottom';
		const style = floating.style;
		const properties: Record<string, string> = {
			'position-anchor': name,
			'position-area': positionArea(physicalSide, physicalAlign),
			'position-try-fallbacks': flip ? (vertical ? 'flip-block' : 'flip-inline') : 'none',
			inset: 'auto',
			margin: '0',
			[MARGIN[physicalSide]]: `${offset}px`
		};
		for (const [property, value] of Object.entries(properties)) style.setProperty(property, value);

		return () => {
			for (const property of Object.keys(properties)) style.removeProperty(property);
			// Other floating elements may share this anchor: remove only this name.
			const rest = anchorStyle
				.getPropertyValue('anchor-name')
				.split(',')
				.map((entry) => entry.trim())
				.filter((entry) => entry && entry !== name);
			if (rest.length) anchorStyle.setProperty('anchor-name', rest.join(', '));
			else anchorStyle.removeProperty('anchor-name');
		};
	};
}
