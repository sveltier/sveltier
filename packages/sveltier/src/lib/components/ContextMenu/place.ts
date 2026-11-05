/** Where a context menu opens from: a pointer's point, or the edges of a focused element. */
export interface ContextPoint {
	/** The inline-start position, in px from the viewport's left. */
	x: number;
	/** Where the menu's top goes when it opens downwards. */
	below: number;
	/** Where the menu's bottom goes when it opens upwards. */
	above: number;
}

/** The space a context menu keeps from the viewport's edges, in px. */
export const EDGE = 8;

/**
 * The viewport position (`left`, `top`) of a menu of `size` opened at `point`: its inline-start,
 * top corner at the point, moved to the other side of the point where it would overflow the
 * viewport, then kept inside it, `EDGE` px from its edges.
 *
 * @example
 * placeAt({ x: 790, below: 300, above: 300 }, { width: 200, height: 100 }, { width: 800, height: 600 }, false);
 * // { left: 590, top: 300 }
 */
export function placeAt(
	point: ContextPoint,
	size: { width: number; height: number },
	viewport: { width: number; height: number },
	rtl: boolean
): { left: number; top: number } {
	const after = rtl ? point.x - size.width : point.x;
	const before = rtl ? point.x : point.x - size.width;
	const fitsAfter = rtl ? after >= EDGE : after + size.width <= viewport.width - EDGE;
	const left = fitsAfter ? after : before;
	const top =
		point.below + size.height <= viewport.height - EDGE ? point.below : point.above - size.height;
	return {
		left: clamp(left, EDGE, viewport.width - EDGE - size.width),
		top: clamp(top, EDGE, viewport.height - EDGE - size.height)
	};
}

// Too big for the viewport: start at its start edge.
function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}
