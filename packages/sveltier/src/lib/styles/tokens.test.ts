import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { aurora, heritage, maison, milano, monolith, SPACES } from '../index.js';

// Every scale derives from the golden ratio; these tests keep the values from drifting.
const PHI = (1 + Math.sqrt(5)) / 2;
const FIBONACCI = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const tokens = new Map(
	Array.from(
		css.matchAll(/(--sv-[\w-]+):\s*([^;]+);/g),
		([, name = '', value = '']) => [name, value.trim()] as const
	)
);

function token(name: string): number {
	const value = tokens.get(name);
	if (value === undefined) throw new Error(`${name} is missing from tokens.css`);
	return parseFloat(value);
}

describe('tokens.css', () => {
	it('sizes type in quarter steps of φ', () => {
		const steps = { label: -3, xs: -2, sm: -1, md: 0, lg: 1, xl: 2, title: 4 };
		for (const [name, quarter] of Object.entries(steps)) {
			expect(token(`--sv-text-${name}`), name).toBeCloseTo(PHI ** (quarter / 4), 4);
		}
	});

	it('bounds the fluid headline and display sizes by powers of φ', () => {
		const bounds = (name: string) =>
			tokens
				.get(name)!
				.match(/clamp\(([\d.]+)rem,.*,\s*([\d.]+)rem\)/)!
				.slice(1)
				.map(Number);
		const [headlineMin, headlineMax] = bounds('--sv-text-headline');
		expect(headlineMin).toBeCloseTo(PHI ** 1.25, 4);
		expect(headlineMax).toBeCloseTo(PHI ** 1.75, 4);
		const [displayMin, displayMax] = bounds('--sv-text-display');
		expect(displayMin).toBeCloseTo(PHI ** 2, 4);
		expect(displayMax).toBeCloseTo(PHI ** 3, 4);
	});

	it('sets line heights to φ^¼, √φ and φ', () => {
		expect(token('--sv-leading-tight')).toBeCloseTo(PHI ** 0.25, 4);
		expect(token('--sv-leading-snug')).toBeCloseTo(PHI ** 0.5, 4);
		expect(token('--sv-leading-normal')).toBeCloseTo(PHI, 4);
	});

	it('spaces in Fibonacci steps named by their size in px', () => {
		const steps = [...tokens.keys()]
			.filter((name) => name.startsWith('--sv-space-'))
			.map((name) => Number(name.slice('--sv-space-'.length)));
		expect(steps).toEqual(FIBONACCI.slice(0, steps.length));
		for (const px of steps) expect(token(`--sv-space-${px}`) * 16).toBe(px);
		// The space scale that props such as a Row's gap take: none, then every space token.
		expect(SPACES).toEqual([0, ...steps]);
	});

	it('sizes controls in half steps of φ and moves density a quarter step', () => {
		const steps = { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 };
		for (const [size, power] of Object.entries(steps)) {
			expect(token(`--sv-control-${size}`), size).toBeCloseTo(PHI ** power, 4);
		}
		expect(token('--sv-density-compact')).toBeCloseTo(PHI ** -0.25, 4);
		expect(token('--sv-density-comfortable')).toBeCloseTo(PHI ** 0.25, 4);
	});

	it('mixes interaction states in Fibonacci percentages', () => {
		expect(FIBONACCI).toContain(token('--sv-state-hover'));
		expect(FIBONACCI).toContain(token('--sv-state-press'));
	});

	it('splits layouts 61.8% / 38.2%', () => {
		expect(token('--sv-golden-major')).toBeCloseTo(100 / PHI, 3);
		expect(token('--sv-golden-minor')).toBeCloseTo(100 - 100 / PHI, 3);
	});
});

describe('theme packs', () => {
	const themes = Object.entries({ ...monolith, ...heritage, ...aurora, ...maison, ...milano });

	it.each(themes)('%s takes radii and durations from the Fibonacci sequence', (_, theme) => {
		const { variables } = theme;
		for (const name of ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const) {
			const px = parseFloat(String(variables[name]));
			// 0 is a square corner and 999px a pill.
			if (px !== 0 && px !== 999) expect(FIBONACCI, name).toContain(px);
		}
		for (const name of ['duration-fast', 'duration-normal', 'duration-slow'] as const) {
			expect(FIBONACCI, name).toContain(parseFloat(String(variables[name])));
		}
	});

	it.each(themes)('%s sizes labels on a quarter step of φ', (_, theme) => {
		const steps = [-3, -2, -1].map((quarter) => +(PHI ** (quarter / 4)).toFixed(4));
		expect(steps).toContain(parseFloat(String(theme.variables['label-size'])));
	});
});
