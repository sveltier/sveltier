import type { LocaleInstance } from '../locale/locale.js';

interface Symbols {
	group: string;
	decimal: string;
	minus: string;
}

// The separators each locale writes numbers with, read once per locale from Intl. Keys are
// locale tags, not user data, so the cache is safe to share across server requests.
const symbols = new Map<string, Symbols>();

function symbolsOf(locale: string): Symbols {
	let found = symbols.get(locale);
	if (!found) {
		const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
		const part = (type: Intl.NumberFormatPartTypes) =>
			parts.find((item) => item.type === type)?.value;
		found = {
			group: part('group') ?? ',',
			decimal: part('decimal') ?? '.',
			minus: part('minusSign') ?? '-'
		};
		symbols.set(locale, found);
	}
	return found;
}

const SPACE = /[\s\u00a0\u202f]/;
const SPACES = /[\s\u00a0\u202f]/g;
const PLAIN = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * Reads what the user typed as a number written in `locale`: group separators and spaces are
 * ignored, the locale's decimal separator and minus sign are understood. `null` when nothing was
 * typed, `NaN` when the text is not a number.
 *
 * @example
 * parseNumber('1,234.5', 'en-US'); // 1234.5
 * parseNumber('1.234,5', 'de-DE'); // 1234.5
 * parseNumber('', 'en-US'); // null
 */
export function parseNumber(text: string, locale: string): number | null {
	const { group, decimal, minus } = symbolsOf(locale);
	let plain = text.trim();
	if (plain === '') return null;
	if (!SPACE.test(group)) plain = plain.split(group).join('');
	plain = plain
		.replace(SPACES, '')
		.split(minus)
		.join('-')
		.replace('\u2212', '-')
		.split(decimal)
		.join('.');
	return PLAIN.test(plain) ? Number(plain) : Number.NaN;
}

/** The HTML constraints of a number field. */
export interface NumberConstraints {
	required?: boolean | null;
	min?: number | null;
	max?: number | null;
	step?: number | null;
}

/** Whether `value` is a whole number of steps from `base`, allowing for binary rounding. */
function onStep(value: number, step: number, base: number): boolean {
	const steps = (value - base) / step;
	return Math.abs(steps - Math.round(steps)) < 1e-9;
}

/**
 * The message for the first constraint `value` breaks, worded by the locale, with numbers in its
 * format. `NaN` stands for text that is not a number. As in HTML, steps count from `min`.
 */
export function numberConstraintMessage(
	value: number | null,
	constraints: NumberConstraints,
	locale: LocaleInstance
): string | undefined {
	const { required, min, max, step } = constraints;
	if (value === null) return required ? locale.t('required') : undefined;
	if (Number.isNaN(value)) return locale.t('badInput');
	const format = (number: number) => locale.formatNumber(number, { maximumFractionDigits: 20 });
	if (min != null && value < min) return locale.t('rangeUnderflow', { min: format(min) });
	if (max != null && value > max) return locale.t('rangeOverflow', { max: format(max) });
	if (step != null && step > 0 && !onStep(value, step, min ?? 0)) {
		return locale.t('stepMismatch', { step: format(step) });
	}
	return undefined;
}
