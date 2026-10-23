import { describe, expect, it } from 'vitest';
import { physical, positionArea } from './anchored.js';
import { place } from './fallback.js';

const viewport = { width: 1000, height: 800 };
const rect = (left: number, top: number, width: number, height: number) => ({
	left,
	top,
	width,
	height,
	right: left + width,
	bottom: top + height
});
const anchor = rect(200, 100, 120, 40);
const floating = { width: 160, height: 80 };

describe('place', () => {
	it('puts the element below the anchor, from its start edge', () => {
		expect(place(anchor, floating, viewport, 'bottom', 'start', 5)).toEqual({
			x: 200,
			y: 145,
			side: 'bottom'
		});
	});

	it('aligns to the end or the centre', () => {
		expect(place(anchor, floating, viewport, 'bottom', 'end', 5).x).toBe(160);
		expect(place(anchor, floating, viewport, 'bottom', 'center', 5).x).toBe(180);
	});

	it('places on the other sides', () => {
		expect(place(anchor, floating, viewport, 'top', 'start', 5)).toMatchObject({ y: 15 });
		expect(place(anchor, floating, viewport, 'right', 'start', 5)).toMatchObject({
			x: 325,
			y: 100
		});
	});

	it('flips to the opposite side when that has more room', () => {
		const low = rect(200, 720, 120, 40);
		expect(place(low, floating, viewport, 'bottom', 'start', 5)).toMatchObject({
			y: 635,
			side: 'top'
		});
		expect(place(low, floating, viewport, 'bottom', 'start', 5, false).side).toBe('bottom');
	});

	it('stays inside the viewport', () => {
		const edge = rect(950, 100, 40, 40);
		expect(place(edge, floating, viewport, 'bottom', 'start', 5).x).toBe(832);
	});
});

describe('physical', () => {
	it('maps start and end to the writing direction', () => {
		expect(physical('bottom', 'start', false)).toEqual(['bottom', 'start']);
		expect(physical('bottom', 'start', true)).toEqual(['bottom', 'end']);
		expect(physical('end', 'start', false)).toEqual(['right', 'start']);
		expect(physical('end', 'start', true)).toEqual(['left', 'start']);
		expect(physical('start', 'center', true)).toEqual(['right', 'center']);
	});
});

describe('positionArea', () => {
	it('spans from the aligned edge, or centres', () => {
		expect(positionArea('bottom', 'start')).toBe('bottom span-right');
		expect(positionArea('bottom', 'end')).toBe('bottom span-left');
		expect(positionArea('top', 'center')).toBe('top');
		expect(positionArea('right', 'start')).toBe('right span-bottom');
	});
});
