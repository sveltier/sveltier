import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import CalendarHarness from '../../../tests/fixtures/CalendarHarness.svelte';
import DatePickerHarness from '../../../tests/fixtures/DatePickerHarness.svelte';
import DateRangePickerHarness from '../../../tests/fixtures/DateRangePickerHarness.svelte';
import { createLocale } from '../../core/locale/locale.js';
import { dateFormat, dateMessage } from './date-field.js';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const strip = (body: string) => body.replace(/<!--.*?-->/g, '');

describe('dates on the server', () => {
	it('renders a calendar month as a grid, the chosen day selected and the tab stop on it', () => {
		const body = strip(render(CalendarHarness, { props: { value: '2026-10-15' } }).body);
		expect(body).toContain('role="grid"');
		expect(body).toContain('October 2026');
		expect(body.match(/<th scope="col"/g)).toHaveLength(7);
		expect(body).toMatch(
			/aria-selected="true"[^>]*><button[^>]*data-date="2026-10-15"[^>]*tabindex="0"/
		);
	});

	it('writes the date of a picker in the locale format and submits it as ISO', () => {
		const body = strip(render(DatePickerHarness, { props: { value: '2026-10-26' } }).body);
		expect(body).toContain('value="10/26/2026"');
		expect(body).toContain('placeholder="mm/dd/yyyy"');
		expect(body).toContain('<input type="hidden" name="day" value="2026-10-26"/>');
	});

	it('names both dates of a range after the label and submits them under one name', () => {
		const body = strip(
			render(DateRangePickerHarness, { props: { start: '2026-10-01', end: '2026-10-26' } }).body
		);
		expect(body).toMatch(/aria-labelledby="(\w+)-label \1-start"/);
		expect(body).toMatch(/aria-labelledby="(\w+)-label \1-end"/);
		expect(body).toContain('<input type="hidden" name="period" value="2026-10-01"/>');
		expect(body).toContain('<input type="hidden" name="period" value="2026-10-26"/>');
	});
});

describe('date checks', () => {
	const en = createLocale(() => ({}));
	const format = dateFormat('en-US');
	const message = (typed: string | null | undefined, checks = {}) =>
		dateMessage(typed, checks, format, en);

	it('reads and writes the locale format', () => {
		expect(format.read('1/5/2026')).toBe('2026-01-05');
		expect(format.read('  ')).toBeNull();
		expect(format.read('5 January')).toBeUndefined();
		expect(format.show('2026-01-05')).toBe('01/05/2026');
	});

	it('reads a two-digit year only once the text is finished', () => {
		expect(format.read('1/5/26')).toBeUndefined();
		expect(format.read('1/5/26', true)).toBe('2026-01-05');
	});

	it('reads back what it writes, whatever calendar and digits the locale has', () => {
		for (const tag of ['en-GB', 'de-DE', 'ja-JP', 'ko-KR', 'th-TH', 'ar-EG', 'fa-IR', 'hi-IN']) {
			const local = dateFormat(tag);
			expect(local.read(local.show('2026-10-26')), tag).toBe('2026-10-26');
		}
		expect(dateFormat('th-TH').show('2026-10-26')).toBe('26/10/2026');
	});

	it('says what is wrong, in order', () => {
		expect(message(undefined)).toBe('Enter a date as mm/dd/yyyy');
		expect(message(null, { required: true })).toBe('Required');
		expect(message(null)).toBeUndefined();
		expect(message('2026-09-30', { min: '2026-10-01' })).toBe('Enter 10/01/2026 or later');
		expect(message('2027-01-01', { max: '2026-12-31' })).toBe('Enter 12/31/2026 or earlier');
		expect(message('2026-10-24', { isDateDisabled: () => true })).toBe(
			'This date cannot be chosen'
		);
		expect(message('2026-10-26', { min: '2026-10-01', max: '2026-12-31' })).toBeUndefined();
	});

	it('leaves out a min or max that is not an ISO date, as the calendar does', () => {
		expect(message('2026-10-26', { min: '2026-10-26T09:30:00Z' })).toBeUndefined();
		expect(message('2026-10-26', { max: '10/01/2026' })).toBeUndefined();
	});
});
