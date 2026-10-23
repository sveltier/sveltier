import { describe, expect, it } from 'vitest';
import { contrast, onColor, parseOklch } from './color.js';

const parse = (value: string) => {
	const color = parseOklch(value);
	if (!color) throw new Error(`Could not parse ${value}`);
	return color;
};

describe('parseOklch', () => {
	it('reads numbers, percentages, degrees and alpha', () => {
		expect(parseOklch('oklch(0.8 0.09 84)')).toEqual({ l: 0.8, c: 0.09, h: 84, alpha: 1 });
		expect(parseOklch('oklch(80% 25% 84deg / 50%)')).toEqual({ l: 0.8, c: 0.1, h: 84, alpha: 0.5 });
		expect(parseOklch(' oklch(1 0 0 / 0.07) ')?.alpha).toBe(0.07);
	});

	it('rejects anything that is not oklch()', () => {
		expect(parseOklch('#fff')).toBeUndefined();
		expect(parseOklch('rgb(0 0 0)')).toBeUndefined();
		expect(parseOklch('oklch(0.5 0.1)')).toBeUndefined();
	});
});

describe('contrast', () => {
	it('matches WCAG extremes', () => {
		expect(contrast(parse('oklch(1 0 0)'), parse('oklch(0 0 0)'))).toBeCloseTo(21, 1);
		expect(contrast(parse('oklch(0.5 0 0)'), parse('oklch(0.5 0 0)'))).toBe(1);
	});

	it('is symmetric', () => {
		const a = parse('oklch(0.8 0.09 84)');
		const b = parse('oklch(0.2 0.02 80)');
		expect(contrast(a, b)).toBe(contrast(b, a));
	});
});

describe('onColor', () => {
	it('puts dark ink on light fills and near-white on dark fills, tinted with the hue', () => {
		expect(onColor('oklch(0.8 0.09 84)')).toBe('oklch(0.2 0.02 84)');
		expect(onColor('oklch(0.45 0.1 250)')).toBe('oklch(0.985 0.005 250)');
	});

	it('returns undefined for colours it cannot read', () => {
		expect(onColor('var(--brand)')).toBeUndefined();
	});
});
