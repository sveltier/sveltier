/**
 * The S stripes field: concentric copies of a large S centreline (top bar, semicircular bowls, spine,
 * bottom bar), centred on (0, 0). Each lane is lines and arcs only; the caller leans the group 10°.
 */
export interface StripeOptions {
	/** Centreline radius of the top bowl. */
	r1: number;
	/** Centreline radius of the bottom bowl (larger: a natural S). */
	r2: number;
	/** Length of the straight spine between the bowls. */
	spine: number;
	/** Distance between lanes. */
	gap: number;
	/** Number of lanes, centred on the centreline. */
	count: number;
	/** How far the bars run out of the S, left and right. */
	reach: number;
}

export function stripes({ r1, r2, spine, gap, count, reach }: StripeOptions): string[] {
	const lanes: string[] = [];
	const x1 = -spine / 2;
	const x2 = spine / 2;
	const first = -Math.floor(count / 2);
	for (let i = 0; i < count; i++) {
		const o = (first + i) * gap;
		const a = r1 + o;
		const b = r2 - o;
		if (a <= 2 || b <= 2) continue;
		const top = -r1 - r2 - o;
		const mid = r1 - r2 + o;
		const bottom = r1 + r2 - o;
		lanes.push(
			`M${reach} ${top}H${x1}A${a} ${a} 0 0 0 ${x1} ${mid}H${x2}A${b} ${b} 0 0 1 ${x2} ${bottom}H${-reach}`
		);
	}
	return lanes;
}
