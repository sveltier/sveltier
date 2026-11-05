import type { LocaleInstance } from '../../core/locale/locale.js';
import {
	asUtcDate,
	dateOrder,
	datePattern,
	numericDate,
	parseIso,
	parseTyped,
	toIso
} from '../Calendar/dates.js';

/** What a date field holds: an ISO date, `null` while empty, `undefined` for text that is not a date. */
export type TypedDate = string | null | undefined;

/** How a locale writes and reads dates in a field. */
export interface DateFormat {
	/** How a date is typed, such as `mm/dd/yyyy`. */
	pattern: string;
	/** An ISO date in the locale's numeric format; empty for none. */
	show(iso: string | null | undefined): string;
	/**
	 * What was typed: an ISO date, `null` for nothing, `undefined` for text that is not a date,
	 * or not one yet. A two-digit year is read only once the text is `finished`.
	 */
	read(text: string, finished?: boolean): TypedDate;
}

export function dateFormat(locale: string): DateFormat {
	const order = dateOrder(locale);
	const numeric = numericDate(locale);
	return {
		pattern: datePattern(locale),
		show(iso) {
			const date = parseIso(iso);
			return date ? numeric.format(asUtcDate(date)) : '';
		},
		read(text, finished = false) {
			if (text.trim() === '') return null;
			const date = parseTyped(text, order, finished);
			return date ? toIso(date) : undefined;
		}
	};
}

/** The limits a date is checked against, as a field's props give them. */
export interface DateChecks {
	required?: boolean;
	min?: string;
	max?: string;
	isDateDisabled?: (date: string) => boolean;
}

/**
 * The message for the first check a date fails, worded by the locale, with dates in its format:
 * text that is not a date, an empty required field, a date before `min` or after `max`, or one
 * ruled out. ISO dates compare as text; a `min` or `max` that is not one is left out, as the
 * calendar leaves it out.
 */
export function dateMessage(
	typed: TypedDate,
	checks: DateChecks,
	format: DateFormat,
	locale: LocaleInstance
): string | undefined {
	if (typed === undefined) return locale.t('badDate', { format: format.pattern });
	if (typed === null) return checks.required ? locale.t('required') : undefined;
	const min = parseIso(checks.min) && checks.min;
	const max = parseIso(checks.max) && checks.max;
	if (min && typed < min) return locale.t('tooEarly', { min: format.show(min) });
	if (max && typed > max) return locale.t('tooLate', { max: format.show(max) });
	if (checks.isDateDisabled?.(typed)) return locale.t('dateUnavailable');
	return undefined;
}
