import { getContext, hasContext, setContext } from 'svelte';

/** Built-in English messages: the labels and announcements of components. */
export const MESSAGES = {
	breadcrumb: 'Breadcrumb',
	close: 'Close',
	loading: 'Loading',
	// The region of toasts, followed by its key: "Notifications (F8)".
	notifications: 'Notifications',
	progress: 'Progress',
	// Validation: the HTML constraints of form fields.
	required: 'Required',
	tooShort: 'Enter at least {min} characters',
	tooLong: 'Enter no more than {max} characters',
	typeEmail: 'Enter a valid email address',
	typeUrl: 'Enter a valid web address',
	patternMismatch: 'Enter a value in the requested format',
	badInput: 'Enter a number',
	rangeUnderflow: 'Enter {min} or more',
	rangeOverflow: 'Enter {max} or less',
	stepMismatch: 'Enter a value in steps of {step}',
	// The buttons of a number field.
	increase: 'Increase',
	decrease: 'Decrease',
	// Pagination: its landmark, its steps and the name of each page.
	pagination: 'Pagination',
	previous: 'Previous page',
	next: 'Next page',
	page: 'Page {page}'
};
export type MessageKey = keyof typeof MESSAGES;
export type Messages = Record<MessageKey, string>;

export interface LocaleOptions {
	/** BCP 47 locale used for formatting, for example "en-GB". Defaults to "en-US". */
	locale?: string;
	/** ISO 4217 currency of formatCurrency(), for example "EUR". Defaults to "USD". */
	currency?: string;
	/** IANA time zone of formatDate(), for example "Europe/London". Defaults to the runtime's. */
	timeZone?: string;
	/** A translation, or single messages merged over the English ones. */
	messages?: Partial<Messages>;
}

/** Messages and formatting, as seen by `useLocale()`. Settings are reactive. */
export interface LocaleInstance {
	readonly locale: string;
	readonly currency: string;
	readonly timeZone: string | undefined;
	/** The message `key`, with `{name}` placeholders replaced from `values`. */
	t(key: MessageKey, values?: Record<string, string | number>): string;
	formatNumber(value: number | bigint, options?: Intl.NumberFormatOptions): string;
	/** Money in `currency` (default: the locale setting). Fraction digits follow the currency. */
	formatCurrency(
		value: number | bigint,
		currency?: string,
		options?: Intl.NumberFormatOptions
	): string;
	/** A ratio as a percentage: 0.0184 is "2%", or "1.84%" with minimumFractionDigits: 2. */
	formatPercent(value: number, options?: Intl.NumberFormatOptions): string;
	formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
	/** Time from `now` in the largest unit that fits: "5 minutes ago", "tomorrow". */
	formatRelative(value: Date | number, now?: Date | number): string;
}

type Formatter = Intl.NumberFormat | Intl.DateTimeFormat | Intl.RelativeTimeFormat;

// Building an Intl formatter is the expensive part, so each one is built once per locale and
// options. Keys hold no user data, so the cache is safe to share across server requests.
const cache = new Map<string, Formatter>();

function cached<F extends Formatter>(
	Format: new (locale: string, options: object) => F,
	locale: string,
	options: object
): F {
	const key = `${Format.name}|${locale}|${JSON.stringify(options)}`;
	let formatter = cache.get(key) as F | undefined;
	if (!formatter) cache.set(key, (formatter = new Format(locale, options)));
	return formatter;
}

// Largest unit first, with its length in seconds.
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 31_536_000],
	['month', 2_592_000],
	['week', 604_800],
	['day', 86_400],
	['hour', 3_600],
	['minute', 60],
	['second', 1]
];

/** Builds a locale whose settings are read through `options` on every call. */
export function createLocale(options: () => LocaleOptions): LocaleInstance {
	const locale = () => options().locale ?? 'en-US';
	const currency = () => options().currency ?? 'USD';
	const timeZone = () => options().timeZone;
	const number = (format: Intl.NumberFormatOptions) => cached(Intl.NumberFormat, locale(), format);

	return {
		get locale() {
			return locale();
		},
		get currency() {
			return currency();
		},
		get timeZone() {
			return timeZone();
		},
		t: (key, values) =>
			(options().messages?.[key] ?? MESSAGES[key]).replace(/\{(\w+)\}/g, (match, name: string) =>
				String(values?.[name] ?? match)
			),
		formatNumber: (value, format = {}) => number(format).format(value),
		formatCurrency: (value, code = currency(), format = {}) =>
			number({ ...format, style: 'currency', currency: code }).format(value),
		formatPercent: (value, format = {}) => number({ ...format, style: 'percent' }).format(value),
		formatDate: (value, format = {}) =>
			cached(Intl.DateTimeFormat, locale(), { timeZone: timeZone(), ...format }).format(value),
		formatRelative: (value, now = Date.now()) => {
			const seconds = (+value - +now) / 1000;
			const [unit, length] = UNITS.find(([, size]) => Math.abs(seconds) >= size) ?? ['second', 1];
			return cached(Intl.RelativeTimeFormat, locale(), { numeric: 'auto' }).format(
				Math.round(seconds / length),
				unit
			);
		}
	};
}

const KEY = Symbol('sveltier.locale');
let shared: LocaleInstance | undefined;

/** Gives a subtree its locale, built from the root's options. */
export const setLocaleContext = (locale: LocaleInstance): LocaleInstance => setContext(KEY, locale);

/**
 * Returns messages and formatters for the current locale. Call it during component
 * initialisation. Without a provider it returns one shared instance with the defaults.
 */
export function useLocale(): LocaleInstance {
	return hasContext(KEY) ? getContext<LocaleInstance>(KEY) : (shared ??= createLocale(() => ({})));
}
