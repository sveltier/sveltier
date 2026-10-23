// Placement for browsers without CSS anchor positioning. Loaded on demand by anchored(), so
// browsers with native support never download it. The floating element is positioned against
// the viewport (a popover in the top layer, or position: fixed) and moved with translate.
import type { Align, PhysicalSide as Physical } from './anchored.js';

interface Size {
	width: number;
	height: number;
}

interface Rect extends Size {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

const OPPOSITE: Record<Physical, Physical> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
};

// Distance kept from the viewport edges, in px.
const PADDING = 8;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/**
 * Where the floating element goes: on `side` of the anchor, aligned along it, on the opposite
 * side when that has more room (with `flip`), and kept inside the viewport.
 */
export function place(
	anchor: Rect,
	floating: Size,
	viewport: Size,
	side: Physical,
	align: Align,
	offset: number,
	flip = true
): { x: number; y: number; side: Physical } {
	const room: Record<Physical, number> = {
		top: anchor.top - PADDING,
		bottom: viewport.height - anchor.bottom - PADDING,
		left: anchor.left - PADDING,
		right: viewport.width - anchor.right - PADDING
	};
	const vertical = side === 'top' || side === 'bottom';
	const need = (vertical ? floating.height : floating.width) + offset;
	if (flip && room[side] < need && room[OPPOSITE[side]] > room[side]) side = OPPOSITE[side];

	const [start, length, size, axis] = vertical
		? [anchor.left, anchor.width, floating.width, viewport.width]
		: [anchor.top, anchor.height, floating.height, viewport.height];
	const cross = clamp(
		align === 'start'
			? start
			: align === 'end'
				? start + length - size
				: start + (length - size) / 2,
		PADDING,
		axis - size - PADDING
	);
	const main =
		side === 'top'
			? anchor.top - offset - floating.height
			: side === 'bottom'
				? anchor.bottom + offset
				: side === 'left'
					? anchor.left - offset - floating.width
					: anchor.right + offset;
	return vertical ? { x: cross, y: main, side } : { x: main, y: cross, side };
}

export interface Placement {
	/** Physical side, as anchored() resolves it from the writing direction. */
	side: Physical;
	/** Physical alignment: start is left or top. */
	align: Align;
	offset: number;
	flip: boolean;
}

/** Keeps `floating` placed against `anchor` until the returned function is called. */
export function follow(
	anchor: Element,
	floating: HTMLElement,
	{ side, align, offset, flip }: Placement
): () => void {
	const style = floating.style;
	style.setProperty('inset', '0 auto auto 0');
	style.setProperty('margin', '0');
	let frame = 0;

	function update() {
		frame = 0;
		const root = document.documentElement;
		const result = place(
			anchor.getBoundingClientRect(),
			floating.getBoundingClientRect(),
			{ width: root.clientWidth, height: root.clientHeight },
			side,
			align,
			offset,
			flip
		);
		style.setProperty('translate', `${result.x}px ${result.y}px`);
		floating.dataset.side = result.side;
	}

	const schedule = () => {
		frame ||= requestAnimationFrame(update);
	};
	const observer = new ResizeObserver(schedule);
	observer.observe(anchor);
	observer.observe(floating);
	addEventListener('scroll', schedule, { capture: true, passive: true });
	addEventListener('resize', schedule, { passive: true });
	update();

	return () => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		removeEventListener('scroll', schedule, { capture: true });
		removeEventListener('resize', schedule);
		for (const property of ['inset', 'margin', 'translate']) style.removeProperty(property);
		delete floating.dataset.side;
	};
}
