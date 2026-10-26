import { describe, expect, it } from 'vitest';
import { createLocale } from '../locale/locale.js';
import {
	numberConstraintMessage,
	parseNumber,
	stepAt,
	stepThrough,
	type StepBand
} from './number.js';

// Tick sizes that change with the price, as a stock exchange sets them.
const TICKS: StepBand[] = [
	{ from: 0, step: 10 },
	{ from: 10000, step: 50 },
	{ from: 50000, step: 100 }
];

describe('parseNumber', () => {
	it('reads numbers as the locale writes them', () => {
		expect(parseNumber('1,234.5', 'en-US')).toBe(1234.5);
		expect(parseNumber('1.234,5', 'de-DE')).toBe(1234.5);
		expect(parseNumber('1 234,5', 'fr-FR')).toBe(1234.5);
		expect(parseNumber('1\u202f234,5', 'fr-FR')).toBe(1234.5);
		expect(parseNumber('-0.25', 'en-US')).toBe(-0.25);
		expect(parseNumber('.5', 'en-US')).toBe(0.5);
		expect(parseNumber('+3', 'en-US')).toBe(3);
	});

	it('gives null for nothing and NaN for what is not a number', () => {
		expect(parseNumber('  ', 'en-US')).toBeNull();
		expect(parseNumber('12a', 'en-US')).toBeNaN();
		expect(parseNumber('1.2.3', 'en-US')).toBeNaN();
		expect(parseNumber('--1', 'en-US')).toBeNaN();
	});

	it('gives the same answer every time', () => {
		for (let i = 0; i < 3; i++) expect(parseNumber('1 234', 'en-US')).toBe(1234);
	});
});

describe('numberConstraintMessage', () => {
	const en = createLocale(() => ({}));
	const check = (
		value: number | null,
		constraints: Parameters<typeof numberConstraintMessage>[1]
	) => numberConstraintMessage(value, constraints, en);

	it('lets an empty value break only required', () => {
		expect(check(null, { required: true, min: 5 })).toBe('Required');
		expect(check(null, { min: 5 })).toBeUndefined();
	});

	it('says what to enter for text, range and step, with numbers in the locale format', () => {
		expect(check(Number.NaN, {})).toBe('Enter a number');
		expect(check(5, { min: 1000 })).toBe('Enter 1,000 or more');
		expect(check(2000, { max: 1500.5 })).toBe('Enter 1,500.5 or less');
		expect(check(0.3, { step: 0.25 })).toBe('Enter a value in steps of 0.25');
	});

	it('counts steps from min, and forgives binary rounding', () => {
		expect(check(3, { min: 1, step: 2 })).toBeUndefined();
		expect(check(4, { min: 1, step: 2 })).toBe('Enter a value in steps of 2');
		expect(check(0.3, { step: 0.1 })).toBeUndefined();
	});
});

describe('steps that change with the value', () => {
	const en = createLocale(() => ({}));

	it('finds the step of the band a value is in, and of the band below on its start going down', () => {
		expect(stepAt(TICKS, 9990)).toBe(10);
		expect(stepAt(TICKS, 10000)).toBe(50);
		expect(stepAt(TICKS, 10000, -1)).toBe(10);
		expect(stepAt(TICKS, 50000, -1)).toBe(50);
		expect(stepAt(0.25, 7)).toBe(0.25);
	});

	it('steps up onto the next band and down into the one below', () => {
		expect(stepThrough(TICKS, 9990, 1)).toBe(10000);
		expect(stepThrough(TICKS, 10000, 1)).toBe(10050);
		expect(stepThrough(TICKS, 49950, 1)).toBe(50000);
		expect(stepThrough(TICKS, 50000, -1)).toBe(49950);
		expect(stepThrough(TICKS, 10000, -1)).toBe(9990);
	});

	it('moves a value off the steps to the next step in that direction', () => {
		expect(stepThrough(TICKS, 10020, 1)).toBe(10050);
		expect(stepThrough(TICKS, 10020, -1)).toBe(10000);
	});

	it('lands on the start of the next band rather than past it', () => {
		const bands: StepBand[] = [
			{ from: 0, step: 3 },
			{ from: 10, step: 5 }
		];
		expect(stepThrough(bands, 9, 1)).toBe(10);
	});

	it('wants each value a multiple of its band step, counted from 0', () => {
		const check = (value: number) => numberConstraintMessage(value, { min: 10, step: TICKS }, en);
		expect(check(10050)).toBeUndefined();
		expect(check(9995)).toBe('Enter a value in steps of 10');
		expect(check(10020)).toBe('Enter a value in steps of 50');
		expect(check(50050)).toBe('Enter a value in steps of 100');
	});
});
