// The base curves of a Guilloche, as SVG path data: pure maths, the same on the server and in
// the browser, numbers rounded to a tenth so the path stays small.

const round = (value: number): string => (Math.round(value * 10) / 10).toString();

function path(points: Array<[number, number]>, close: boolean): string {
	const [first, ...rest] = points;
	if (!first) return '';
	return `M${round(first[0])} ${round(first[1])}L${rest
		.map(([x, y]) => `${round(x)} ${round(y)}`)
		.join(' ')}${close ? 'Z' : ''}`;
}

/** The side of the rosette's square box. */
export const ROSETTE_SIZE = 200;

/** The rosette repeats itself every 360° / ROSETTE_SYMMETRY, so its copies turn within that. */
export const ROSETTE_SYMMETRY = 9;

/**
 * A hypotrochoid about the centre of a 200-unit box: a point at `d` from the centre of a circle
 * of radius `r` rolling inside one of radius `R`. With R = 9r it closes after one turn with nine
 * lobes; turned about the centre, copies of it interlace into an even mesh, as on a banknote.
 */
export function rosette(steps = 360): string {
	const big = 90;
	const small = 10;
	const arm = 40;
	const centre = ROSETTE_SIZE / 2;
	// Scaled to reach just inside the box's edge.
	const scale = (centre - 2) / (big - small + arm);
	const k = (big - small) / small;
	const points: Array<[number, number]> = [];
	for (let i = 0; i < steps; i++) {
		const t = (i / steps) * 2 * Math.PI;
		points.push([
			centre + scale * ((big - small) * Math.cos(t) + arm * Math.cos(k * t)),
			centre + scale * ((big - small) * Math.sin(t) - arm * Math.sin(k * t))
		]);
	}
	return path(points, true);
}

/** The box of the waves: as wide as two periods, so a band can be shifted by up to one. */
export const WAVES_WIDTH = 400;
export const WAVES_HEIGHT = 200;

/**
 * A sine band across the waves' box, twice as wide as the view so each copy can be shifted in
 * phase, with a slower sine on top that makes the bands swell and narrow as they cross.
 */
export function wave(steps = 160): string {
	const points: Array<[number, number]> = [];
	for (let i = 0; i <= steps; i++) {
		const x = (i / steps) * WAVES_WIDTH;
		const t = (x / (WAVES_WIDTH / 2)) * 2 * Math.PI;
		points.push([x, 12 * Math.sin(t) + 5 * Math.sin(3 * t + 1)]);
	}
	return path(points, false);
}
