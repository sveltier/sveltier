/** A day of the Gregorian calendar, with no time and no time zone. `month` counts from 1. */
export interface PlainDate {
	year: number;
	month: number;
	day: number;
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

// Dates are worked out in UTC, where no day is skipped or doubled by a clock change. Years
// under 100 are set apart, since Date.UTC reads them as 19xx.
function toUtc({ year, month, day }: PlainDate): Date {
	const date = new Date(0);
	date.setUTCFullYear(year, month - 1, day);
	return date;
}

const fromUtc = (date: Date): PlainDate => ({
	year: date.getUTCFullYear(),
	month: date.getUTCMonth() + 1,
	day: date.getUTCDate()
});

/** Whether the date exists: 2026-02-30 does not. */
export function isReal(date: PlainDate): boolean {
	const back = fromUtc(toUtc(date));
	return back.year === date.year && back.month === date.month && back.day === date.day;
}

/** Reads an ISO date, `YYYY-MM-DD`: `null` for anything else or a day that does not exist. */
export function parseIso(text: string | null | undefined): PlainDate | null {
	const match = text ? ISO.exec(text) : null;
	if (!match) return null;
	const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
	return isReal(date) ? date : null;
}

/** The date as ISO, `YYYY-MM-DD`. */
export function toIso({ year, month, day }: PlainDate): string {
	const pad = (number: number, size: number) => String(number).padStart(size, '0');
	return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** The date `days` days later, or earlier for a negative count. */
export function addDays(date: PlainDate, days: number): PlainDate {
	const utc = toUtc(date);
	utc.setUTCDate(utc.getUTCDate() + days);
	return fromUtc(utc);
}

/** The number of days in a month. */
export function daysInMonth(year: number, month: number): number {
	return fromUtc(toUtc({ year, month: month + 1, day: 0 })).day;
}

/** The same day `months` months later or earlier, kept within the month: Jan 31 + 1 is Feb 28. */
export function addMonths(date: PlainDate, months: number): PlainDate {
	const index = date.year * 12 + date.month - 1 + months;
	const year = Math.floor(index / 12);
	const month = index - year * 12 + 1;
	return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

/** Negative when `a` comes first, positive when `b` does, 0 for the same day. */
export function compare(a: PlainDate, b: PlainDate): number {
	return a.year - b.year || a.month - b.month || a.day - b.day;
}

/** The day of the week: 0 is Sunday, 6 is Saturday. */
export const weekday = (date: PlainDate): number => toUtc(date).getUTCDay();

/** The date as a UTC Date, for `Intl.DateTimeFormat` with `timeZone: 'UTC'`. */
export const asUtcDate = toUtc;

/** Today in a time zone, such as a market's, or where the browser, or the server, is. */
export function today(timeZone?: string): PlainDate {
	const now = new Date();
	if (!timeZone) return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
	const parts = numericDate('en-US', timeZone).formatToParts(now);
	const part = (type: string) => Number(parts.find((each) => each.type === type)?.value);
	return { year: part('year'), month: part('month'), day: part('day') };
}

/**
 * A locale's numeric date, `10/26/2026` in en-US, always in the Gregorian calendar and Latin
 * digits: a locale such as th-TH counts years in another calendar, and ar-EG writes other
 * digits, which a field could not read back.
 */
export function numericDate(locale: string, timeZone = 'UTC'): Intl.DateTimeFormat {
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone,
		calendar: 'gregory',
		numberingSystem: 'latn'
	});
}

/**
 * The days of a month as six weeks of seven, the first starting on `firstDay` (0 Sunday to 6
 * Saturday). Days of the months around it are `null`, so the grid keeps its height.
 */
export function monthWeeks(year: number, month: number, firstDay: number): (PlainDate | null)[][] {
	const offset = (weekday({ year, month, day: 1 }) - firstDay + 7) % 7;
	const count = daysInMonth(year, month);
	return Array.from({ length: 6 }, (_, week) =>
		Array.from({ length: 7 }, (_, column) => {
			const day = week * 7 + column - offset + 1;
			return day >= 1 && day <= count ? { year, month, day } : null;
		})
	);
}

// Regions whose week starts on Sunday, Saturday or Friday, from CLDR, for engines without
// `Intl.Locale` week info. The rest start on Monday.
const SUNDAY = new Set(
	'AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
		' '
	)
);
const SATURDAY = new Set('AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '));

type WeekInfo = { firstDay: number };

/** The first day of the week in a locale: 0 Sunday to 6 Saturday. */
export function firstDayOf(locale: string): number {
	try {
		const tag = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => WeekInfo;
			weekInfo?: WeekInfo;
		};
		const info = tag.getWeekInfo?.() ?? tag.weekInfo;
		// Intl counts from 1 for Monday to 7 for Sunday.
		if (info) return info.firstDay % 7;
		const region = tag.maximize().region ?? '';
		return SUNDAY.has(region) ? 0 : SATURDAY.has(region) ? 6 : region === 'MV' ? 5 : 1;
	} catch {
		return 1;
	}
}

/** The order of day, month and year in a locale's numeric date: `'mdy'`, `'dmy'` or `'ymd'`. */
export function dateOrder(locale: string): string {
	return numericDate(locale)
		.formatToParts(new Date(Date.UTC(2006, 10, 22)))
		.filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
		.map((part) => part.type[0])
		.join('');
}

/** How a date is typed in a locale, for a placeholder or a message: `mm/dd/yyyy`, `dd.mm.yyyy`. */
export function datePattern(locale: string): string {
	const names: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {
		day: 'dd',
		month: 'mm',
		year: 'yyyy'
	};
	return numericDate(locale)
		.formatToParts(new Date(Date.UTC(2006, 10, 22)))
		.map((part) => names[part.type] ?? part.value)
		.join('');
}

// Digits typed with no separators, as a fast typist enters them: 10262026 in en-US. Six digits,
// with a two-digit year, only once the text is finished.
function compact(digits: string, order: string, finished: boolean): string[] {
	const year = digits.length === 8 ? 4 : finished && digits.length === 6 ? 2 : 0;
	if (!year) return [];
	let at = 0;
	return [...order].map((key) => digits.slice(at, (at += key === 'y' ? year : 2)));
}

/**
 * Reads a date typed as a person writes it: day, month and year in the locale's `order`, with
 * any separators or none, or year first when it has four digits, as ISO writes it. While the
 * text is still being typed, the last number must be whole (four digits for a year, two for a
 * day or a month), so `10/26/20` is not read as 2020 on the way to 2026. Once it is `finished`,
 * a two-digit year counts from 2000 and a one-digit day or month is whole. `null` for text with
 * letters, or a day that does not exist.
 */
export function parseTyped(text: string, order: string, finished = false): PlainDate | null {
	const trimmed = text.trim();
	if (/\p{L}/u.test(trimmed)) return null;
	let groups = trimmed.split(/\D+/).filter(Boolean);
	if (groups.length === 1) groups = compact(groups[0]!, order, finished);
	if (groups.length !== 3) return null;
	const keys = groups[0]!.length === 4 ? 'ymd' : order;
	// The last number can still grow while the text ends with a digit.
	const open = !finished && /\d$/.test(trimmed);
	const parts: Record<string, number> = {};
	for (const [i, group] of groups.entries()) {
		const key = keys[i]!;
		const settled = !open || i < 2;
		const whole = group.length === (key === 'y' ? 4 : 2);
		const short = settled && group.length === (key === 'y' ? 2 : 1);
		if (!whole && !short) return null;
		parts[key] = Number(group) + (key === 'y' && group.length === 2 ? 2000 : 0);
	}
	const date = { year: parts.y!, month: parts.m!, day: parts.d! };
	return isReal(date) ? date : null;
}
