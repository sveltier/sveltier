import { describe, expect, it } from 'vitest';
import { cubicBezier } from './easing.js';
import { SPRINGS, easing } from './motion.js';

const PHI = (1 + Math.sqrt(5)) / 2;

describe('cubicBezier', () => {
	it('starts at 0 and ends at 1', () => {
		const ease = cubicBezier(0.236, 0, 0, 1);
		expect(ease(0)).toBe(0);
		expect(ease(1)).toBe(1);
		expect(ease(-1)).toBe(0);
		expect(ease(2)).toBe(1);
	});

	it('matches known curves', () => {
		const linear = cubicBezier(0, 0, 1, 1);
		for (const t of [0.1, 0.5, 0.9]) expect(linear(t)).toBeCloseTo(t, 5);
		// CSS "ease" at its midpoint.
		expect(cubicBezier(0.25, 0.1, 0.25, 1)(0.5)).toBeCloseTo(0.8024, 3);
	});

	it('only moves forward for monotonic curves', () => {
		const ease = cubicBezier(0.236, 0, 0, 1);
		let previous = 0;
		for (let t = 0.01; t <= 1; t += 0.01) {
			const value = ease(t);
			expect(value).toBeGreaterThanOrEqual(previous - 1e-9);
			previous = value;
		}
	});
});

describe('easing', () => {
	it('reads cubic-bezier() and keywords', () => {
		expect(easing('cubic-bezier(0, 0, 1, 1)')(0.3)).toBeCloseTo(0.3, 5);
		expect(easing('linear')(0.3)).toBeCloseTo(0.3, 5);
		expect(easing('ease')(0.5)).toBeCloseTo(0.8024, 3);
		expect(easing('unknown')(0.5)).toBeCloseTo(0.8024, 3);
	});
});

describe('SPRINGS', () => {
	it('follow the φ series', () => {
		expect(SPRINGS.snappy.stiffness).toBeCloseTo(PHI ** -3, 3);
		expect(SPRINGS.standard.stiffness).toBeCloseTo(PHI ** -4, 3);
		expect(SPRINGS.gentle.stiffness).toBeCloseTo(PHI ** -5, 2);
		for (const preset of Object.values(SPRINGS)) {
			expect(preset.stiffness + preset.damping).toBeCloseTo(1, 5);
		}
	});
});
