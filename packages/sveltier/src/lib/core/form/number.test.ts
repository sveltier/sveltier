import { describe, expect, it } from 'vitest';
import { createLocale } from '../locale/locale.js';
import { numberConstraintMessage, parseNumber } from './number.js';

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
