/**
 * An easing function from cubic-bezier control points, as CSS `cubic-bezier()` defines it.
 * Use it where a function is needed (Svelte transitions, Tween); CSS and `element.animate()`
 * take the string directly.
 *
 * @example
 * const standard = cubicBezier(0.236, 0, 0, 1);
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
	// Polynomial coefficients of x(s) and y(s) for the curve parameter s.
	const cx = 3 * x1;
	const bx = 3 * (x2 - x1) - cx;
	const ax = 1 - cx - bx;
	const cy = 3 * y1;
	const by = 3 * (y2 - y1) - cy;
	const ay = 1 - cy - by;
	const x = (s: number) => ((ax * s + bx) * s + cx) * s;
	const y = (s: number) => ((ay * s + by) * s + cy) * s;
	const slope = (s: number) => (3 * ax * s + 2 * bx) * s + cx;

	return (t) => {
		if (t <= 0 || t >= 1) return t <= 0 ? 0 : 1;
		// Newton's method from s = t, then bisection if the slope is too flat to trust.
		let s = t;
		for (let i = 0; i < 8; i++) {
			const error = x(s) - t;
			if (Math.abs(error) < 1e-6) return y(s);
			const d = slope(s);
			if (Math.abs(d) < 1e-6) break;
			s -= error / d;
		}
		let low = 0;
		let high = 1;
		s = t;
		for (let i = 0; i < 32 && high - low > 1e-6; i++) {
			if (x(s) < t) low = s;
			else high = s;
			s = (low + high) / 2;
		}
		return y(s);
	};
}
