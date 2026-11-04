import type { LocaleInstance } from '../../core/locale/locale.js';

/** Minutes in a day: a time of day is a whole number of minutes from midnight, below it. */
export const DAY = 24 * 60;

const CLOCK = /^(\d{2}):(\d{2})$/;

const pad = (number: number) => String(number).padStart(2, '0');

/** Reads a time as a time input's value, `HH:mm`, as minutes from midnight; `null` otherwise. */
export function parseClock(text: string | null | undefined): number | null {
	const match = text ? CLOCK.exec(text) : null;
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

/** Minutes from midnight as `HH:mm`. */
export const toClock = (minutes: number): string =>
	`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

// A locale's time to the minute, in Latin digits, whatever its own digits.
const numericTime = (locale: string) =>
	new Intl.DateTimeFormat(locale, {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC',
		numberingSystem: 'latn'
	});

const at = (minutes: number) => new Date(Date.UTC(1970, 0, 1, 0, minutes));

// Engines put a narrow or no-break space before the day period, or not, by version: a plain one
// reads the same, and the server and the browser then write the same text.
const plain = (text: string) => text.replace(/\s/g, ' ');

// A day period as typed: lower case, with no dots or spaces, so "P.M." is "pm".
const fold = (word: string) => word.toLowerCase().replace(/[.\s]/g, '');

/**
 * Reads a time typed as a person writes it: hours and minutes with any separator or none
 * (`9:30`, `0930`, `21.30`), and a day period, Latin (`am`, `p`) or the locale's own
 * (`periods`). A time without one is on the 24-hour clock, so typing `9:30 pm` goes through
 * 09:30, a whole time, to 21:30. While the text is still being typed the minutes must be whole,
 * so `9:3` is not 09:03 on the way to 09:30, and hours alone wait for a day period; once it is
 * `finished`, `9` is 09:00 and `930` is 09:30. Minutes from midnight, or `null` when it is not a
 * time (yet).
 */
export function parseTime(
	text: string,
	periods: { am: string; pm: string },
	finished = false
): number | null {
	const trimmed = text.trim();
	const word = fold(trimmed.replace(/[\d:]/g, ''));
	const pm = ['p', 'pm', periods.pm].includes(word);
	if (word && !pm && !['a', 'am', periods.am].includes(word)) return null;
	const groups = trimmed.match(/\d+/g) ?? [];
	// The last number can still grow while the text ends with a digit.
	const open = !finished && /\d$/.test(trimmed);
	let hours: string | undefined;
	let minutes: string | undefined;
	if (groups.length === 2) [hours, minutes] = groups;
	else if (groups.length === 1) {
		const digits = groups[0]!;
		if (digits.length === 4 || (!open && digits.length === 3)) {
			[hours, minutes] = [digits.slice(0, -2), digits.slice(-2)];
		} else if ((finished || word) && digits.length <= 2) [hours, minutes] = [digits, '00'];
	}
	if (hours === undefined || minutes === undefined || hours.length > 2) return null;
	if (minutes.length !== 2 && (open || minutes.length !== 1)) return null;
	let hour = Number(hours);
	const minute = Number(minutes);
	if (minute > 59) return null;
	if (word) {
		if (hour < 1 || hour > 12) return null;
		hour = (hour % 12) + (pm ? 12 : 0);
	} else if (hour > 23) return null;
	return hour * 60 + minute;
}

/** Where a time steps to, in minutes from midnight. */
export interface TimeSteps {
	/** The earliest time, in minutes; the steps count from it. */
	min?: number | null;
	/** The latest time, in minutes. */
	max?: number | null;
	/** Minutes between the steps. */
	step?: number;
}

/**
 * The time a key moves `minutes` to, as a native time input moves it: ArrowUp and ArrowDown by
 * a step along the steps counted from `min` (else midnight), Page Up and Page Down by an hour,
 * Home and End to `min` and `max` when set, always within them. An empty time starts at `min`,
 * or midnight. `undefined` for any other key.
 */
export function stepTime(
	key: string,
	minutes: number | null,
	limits: TimeSteps
): number | undefined {
	const every = Math.max(1, Math.round(limits.step ?? 1));
	const start = limits.min ?? 0;
	const last = start + Math.floor(((limits.max ?? DAY - 1) - start) / every) * every;
	const hour = Math.max(1, Math.round(60 / every));
	const steps: Record<string, number | undefined> = {
		ArrowUp: 1,
		ArrowDown: -1,
		PageUp: hour,
		PageDown: -hour,
		Home: limits.min == null ? undefined : -DAY,
		End: limits.max == null ? undefined : DAY
	};
	const count = steps[key];
	if (count === undefined) return undefined;
	if (minutes === null) return start;
	const offset = (minutes - start) / every;
	const from = count > 0 ? Math.floor(offset) : Math.ceil(offset);
	return Math.min(last, Math.max(start, start + (from + count) * every));
}

/** What a time field holds: `HH:mm`, `null` while empty, `undefined` for text that is not a time. */
export type TypedTime = string | null | undefined;

/** How a locale writes and reads times in a field. */
export interface TimeFormat {
	/** How a time is typed, such as `hh:mm AM` or `hh:mm`. */
	pattern: string;
	/** A time, `HH:mm`, in the locale's format; empty for none. */
	show(clock: string | null | undefined): string;
	/**
	 * What was typed: `HH:mm`, `null` for nothing, `undefined` for text that is not a time, or not
	 * one yet. Hours alone and three digits are read only once the text is `finished`.
	 */
	read(text: string, finished?: boolean): TypedTime;
}

export function timeFormat(locale: string): TimeFormat {
	const numeric = numericTime(locale);
	const period = (minutes: number) =>
		numeric.formatToParts(at(minutes)).find((part) => part.type === 'dayPeriod')?.value ?? '';
	const periods = { am: fold(period(9 * 60)) || 'am', pm: fold(period(21 * 60)) || 'pm' };
	const names: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = { hour: 'hh', minute: 'mm' };
	return {
		pattern: numeric
			.formatToParts(at(9 * 60))
			.map((part) => names[part.type] ?? plain(part.value))
			.join(''),
		show(clock) {
			const minutes = parseClock(clock);
			return minutes === null ? '' : plain(numeric.format(at(minutes)));
		},
		read(text, finished = false) {
			if (text.trim() === '') return null;
			const minutes = parseTime(text, periods, finished);
			return minutes === null ? undefined : toClock(minutes);
		}
	};
}

/** The limits a time is checked against, as the field's props give them. */
export interface TimeChecks {
	required?: boolean;
	min?: string;
	max?: string;
	/** Minutes between the times that can be chosen, counted from `min`, else from midnight. */
	step?: number;
}

/**
 * The message for the first check a time fails, worded by the locale, with times in its format:
 * text that is not a time, an empty required field, a time before `min` or after `max`, or off
 * the steps. A `min` or `max` that is not `HH:mm` is left out.
 */
export function timeMessage(
	typed: TypedTime,
	checks: TimeChecks,
	format: TimeFormat,
	locale: LocaleInstance
): string | undefined {
	if (typed === undefined) return locale.t('badTime', { format: format.pattern });
	if (typed === null) return checks.required ? locale.t('required') : undefined;
	const min = parseClock(checks.min) === null ? undefined : checks.min;
	const max = parseClock(checks.max) === null ? undefined : checks.max;
	if (min && typed < min) return locale.t('tooEarly', { min: format.show(min) });
	if (max && typed > max) return locale.t('tooLate', { max: format.show(max) });
	const step = checks.step ?? 1;
	if (step > 1 && (parseClock(typed)! - (parseClock(min) ?? 0)) % step !== 0) {
		return locale.t('timeStep', { step });
	}
	return undefined;
}
