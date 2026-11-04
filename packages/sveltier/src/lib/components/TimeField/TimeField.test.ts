import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TimeFieldHarness from '../../../tests/fixtures/TimeFieldHarness.svelte';
import { createLocale } from '../../core/locale/locale.js';
import { parseClock, parseTime, timeFormat, timeMessage, toClock } from './time.js';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const strip = (body: string) => body.replace(/<!--.*?-->/g, '');
const periods = { am: 'am', pm: 'pm' };
const read = (text: string, finished = false) => {
	const minutes = parseTime(text, periods, finished);
	return minutes === null ? null : toClock(minutes);
};

describe('times', () => {
	it('reads and writes HH:mm', () => {
		expect(parseClock('09:30')).toBe(570);
		expect(parseClock('23:59')).toBe(1439);
		expect(parseClock('24:00')).toBeNull();
		expect(parseClock('9:30')).toBeNull();
		expect(toClock(570)).toBe('09:30');
	});

	it('reads a time typed with any separator or none, on either clock', () => {
		expect(read('9:30')).toBe('09:30');
		expect(read('21.30')).toBe('21:30');
		expect(read('0930')).toBe('09:30');
		expect(read('9:30 pm')).toBe('21:30');
		expect(read('9:30 P.M.')).toBe('21:30');
		expect(read('12:05 am')).toBe('00:05');
		expect(read('12:05 pm')).toBe('12:05');
		expect(read('9pm')).toBe('21:00');
		expect(read('13:30 pm')).toBeNull();
		expect(read('9:60')).toBeNull();
		expect(read('25:00')).toBeNull();
		expect(read('9:30 xyz')).toBeNull();
	});

	it('waits for whole minutes while the time is typed, and reads short ones once finished', () => {
		// On the way to 09:30, 9:3 is not 09:03.
		expect(read('9:3')).toBeNull();
		expect(read('9')).toBeNull();
		expect(read('930')).toBeNull();
		expect(read('9:3', true)).toBe('09:03');
		expect(read('9', true)).toBe('09:00');
		expect(read('930', true)).toBe('09:30');
		expect(read('9:')).toBeNull();
	});
});

describe('time formats', () => {
	it("writes the locale's format, and reads back what it writes", () => {
		expect(timeFormat('en-US').show('21:05')).toBe('09:05 PM');
		expect(timeFormat('en-US').pattern).toBe('hh:mm AM');
		expect(timeFormat('en-GB').show('21:05')).toBe('21:05');
		expect(timeFormat('en-GB').pattern).toBe('hh:mm');
		for (const tag of ['en-US', 'en-GB', 'ko-KR', 'ar-EG', 'hi-IN', 'ja-JP']) {
			const local = timeFormat(tag);
			expect(local.read(local.show('21:05')), tag).toBe('21:05');
			expect(local.read(local.show('09:05')), tag).toBe('09:05');
		}
	});

	it('says what is wrong, in order', () => {
		const en = createLocale(() => ({}));
		const format = timeFormat('en-US');
		const message = (typed: string | null | undefined, checks = {}) =>
			timeMessage(typed, checks, format, en);
		expect(message(undefined)).toBe('Enter a time as hh:mm AM');
		expect(message(null, { required: true })).toBe('Required');
		expect(message('07:59', { min: '08:00' })).toBe('Enter 08:00 AM or later');
		expect(message('18:01', { max: '18:00' })).toBe('Enter 06:00 PM or earlier');
		expect(message('08:20', { min: '08:00', step: 15 })).toBe(
			'Enter a time in steps of 15 minutes'
		);
		expect(message('08:30', { min: '08:00', step: 15 })).toBeUndefined();
		expect(message('08:30', { min: '8:00' })).toBeUndefined();
	});
});

describe('TimeField on the server', () => {
	it('writes the time in the locale format, as a spinbutton, and submits HH:mm', () => {
		const body = strip(render(TimeFieldHarness, { props: { value: '21:05' } }).body);
		expect(body).toContain('value="09:05 PM"');
		expect(body).toContain('role="spinbutton"');
		expect(body).toContain('aria-valuenow="1265"');
		expect(body).toContain('aria-valuetext="09:05 PM"');
		expect(body).toContain('<input type="hidden" name="at" value="21:05"/>');
	});
});
