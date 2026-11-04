import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	addDays,
	addMonths,
	compare,
	dateOrder,
	datePattern,
	daysInMonth,
	firstDayOf,
	isReal,
	monthWeeks,
	parseIso,
	parseTyped,
	today,
	toIso,
	weekday
} from './dates.js';

const d = (year: number, month: number, day: number) => ({ year, month, day });

describe('ISO dates', () => {
	it('reads and writes YYYY-MM-DD, and refuses days that do not exist', () => {
		expect(parseIso('2026-10-26')).toEqual(d(2026, 10, 26));
		expect(toIso(d(2026, 1, 5))).toBe('2026-01-05');
		expect(toIso(d(812, 3, 9))).toBe('0812-03-09');
		expect(parseIso('2026-02-30')).toBeNull();
		expect(parseIso('2026-2-3')).toBeNull();
		expect(parseIso('')).toBeNull();
		expect(parseIso(null)).toBeNull();
	});

	it('knows leap years and early years', () => {
		expect(isReal(d(2024, 2, 29))).toBe(true);
		expect(isReal(d(2026, 2, 29))).toBe(false);
		expect(isReal(d(1900, 2, 29))).toBe(false);
		expect(isReal(d(2000, 2, 29))).toBe(true);
		expect(addDays(d(99, 12, 31), 1)).toEqual(d(100, 1, 1));
	});
});

describe('date arithmetic', () => {
	it('adds days across months and years', () => {
		expect(addDays(d(2026, 10, 31), 1)).toEqual(d(2026, 11, 1));
		expect(addDays(d(2026, 1, 1), -1)).toEqual(d(2025, 12, 31));
		expect(addDays(d(2026, 3, 1), -7)).toEqual(d(2026, 2, 22));
	});

	it('adds months within the target month', () => {
		expect(addMonths(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
		expect(addMonths(d(2024, 1, 31), 1)).toEqual(d(2024, 2, 29));
		expect(addMonths(d(2026, 12, 15), 1)).toEqual(d(2027, 1, 15));
		expect(addMonths(d(2026, 1, 15), -13)).toEqual(d(2024, 12, 15));
	});

	it('counts days, compares and finds the weekday', () => {
		expect(daysInMonth(2026, 2)).toBe(28);
		expect(daysInMonth(2024, 2)).toBe(29);
		expect(daysInMonth(2026, 12)).toBe(31);
		expect(compare(d(2026, 1, 2), d(2026, 1, 10))).toBeLessThan(0);
		expect(compare(d(2026, 1, 2), d(2026, 1, 2))).toBe(0);
		expect(weekday(d(2026, 10, 26))).toBe(1);
	});

	describe('today', () => {
		afterEach(() => vi.useRealTimers());

		it('is the day in a time zone when one is given', () => {
			vi.useFakeTimers({ now: Date.UTC(2026, 9, 26, 23, 30) });
			expect(today('Asia/Tokyo')).toEqual(d(2026, 10, 27));
			expect(today('America/New_York')).toEqual(d(2026, 10, 26));
		});
	});
});

describe('month weeks', () => {
	it('lays a month out in six weeks from the first day of the week, blank around it', () => {
		// October 2026 starts on a Thursday.
		const monday = monthWeeks(2026, 10, 1);
		expect(monday).toHaveLength(6);
		expect(monday[0]!.map((date) => date?.day ?? null)).toEqual([null, null, null, 1, 2, 3, 4]);
		const sunday = monthWeeks(2026, 10, 0);
		expect(sunday[0]!.map((date) => date?.day ?? null)).toEqual([null, null, null, null, 1, 2, 3]);
		expect(sunday.flat().filter(Boolean)).toHaveLength(31);
	});
});

describe('locale order', () => {
	it('starts the week where the locale does', () => {
		expect(firstDayOf('en-US')).toBe(0);
		expect(firstDayOf('en-GB')).toBe(1);
		expect(firstDayOf('vi-VN')).toBe(1);
	});

	it('reads the order of day, month and year, in Gregorian years and Latin digits', () => {
		expect(dateOrder('en-US')).toBe('mdy');
		expect(dateOrder('en-GB')).toBe('dmy');
		expect(dateOrder('ja-JP')).toBe('ymd');
		// th-TH counts Buddhist years and ar-EG writes Arabic digits by default.
		expect(datePattern('th-TH')).toBe('dd/mm/yyyy');
		expect(datePattern('ar-EG').replace(/‏/g, '')).toBe('dd/mm/yyyy');
		expect(datePattern('ko-KR')).toBe('yyyy. mm. dd.');
	});

	it('reads a date typed in that order, with any separators or none, and ISO', () => {
		expect(parseTyped('10/26/2026', 'mdy')).toEqual(d(2026, 10, 26));
		expect(parseTyped('1/5/2026', 'mdy')).toEqual(d(2026, 1, 5));
		expect(parseTyped(' 26.10.2026 ', 'dmy')).toEqual(d(2026, 10, 26));
		expect(parseTyped('2026. 10. 26.', 'ymd')).toEqual(d(2026, 10, 26));
		expect(parseTyped('10262026', 'mdy')).toEqual(d(2026, 10, 26));
		expect(parseTyped('20261026', 'ymd')).toEqual(d(2026, 10, 26));
		// A four-digit first number is a year, as ISO writes it, in any locale.
		expect(parseTyped('2026-10-26', 'dmy')).toEqual(d(2026, 10, 26));
		expect(parseTyped('2026/10/26', 'mdy')).toEqual(d(2026, 10, 26));
		expect(parseTyped('31/02/2026', 'dmy')).toBeNull();
		expect(parseTyped('10/26', 'mdy')).toBeNull();
		expect(parseTyped('010/26/2026', 'mdy')).toBeNull();
		expect(parseTyped('10/26/2026 xyz', 'mdy')).toBeNull();
		expect(parseTyped('Oct 26 2026', 'mdy')).toBeNull();
	});

	it('waits for the last number while the text is typed, and reads short ones once finished', () => {
		// On the way to 2026, 10/26/20 is not 2020, and 2026-10-2 is not the 2nd.
		expect(parseTyped('10/26/20', 'mdy')).toBeNull();
		expect(parseTyped('10/26/202', 'mdy')).toBeNull();
		expect(parseTyped('2026-10-2', 'ymd')).toBeNull();
		expect(parseTyped('10/26/20', 'mdy', true)).toEqual(d(2020, 10, 26));
		expect(parseTyped('26 10 26', 'dmy', true)).toEqual(d(2026, 10, 26));
		expect(parseTyped('2026-10-2', 'ymd', true)).toEqual(d(2026, 10, 2));
		expect(parseTyped('2026-1-5', 'mdy', true)).toEqual(d(2026, 1, 5));
		expect(parseTyped('102626', 'mdy', true)).toEqual(d(2026, 10, 26));
		expect(parseTyped('10/26/202', 'mdy', true)).toBeNull();
	});
});
