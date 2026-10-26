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

/**
 * A band of values with a step of its own: from `from` up to the next band's start, values move
 * by `step`, as the tick size of a market changes with the price.
 */
export interface StepBand {
	/** The lowest value of the band. */
	from: number;
	/** How far a value in the band moves, and the multiple it must be of. */
	step: number;
}

/** A fixed step, or bands of steps ordered by `from`. */
export type NumberStep = number | readonly StepBand[];

/** The HTML constraints of a number field, with steps that may change with the value. */
export interface NumberConstraints {
	required?: boolean | null;
	min?: number | null;
	max?: number | null;
	step?: NumberStep | null;
}

/**
 * The step at `value`. Going down (`direction` -1), a value on a band's start takes the band
 * below, so 50,000 steps down to 49,950 when the step is 100 from 50,000 and 50 below it.
 */
export function stepAt(step: NumberStep, value: number, direction: 1 | -1 = 1): number {
	if (typeof step === 'number') return step;
	let found = step[0]?.step ?? 1;
	for (const band of step) {
		if (direction > 0 ? value >= band.from : value > band.from) found = band.step;
		else break;
	}
	return found;
}

/**
 * The value one step from `value` through bands of steps: to the next multiple of the step in
 * that direction, and onto the start of the next band up rather than past it.
 */
export function stepThrough(bands: readonly StepBand[], value: number, direction: 1 | -1): number {
	const size = stepAt(bands, value, direction);
	const units = value / size;
	const from = direction > 0 ? Math.floor(units + 1e-9) : Math.ceil(units - 1e-9);
	const next = (from + direction) * size;
	const upper = direction > 0 ? bands.find((band) => band.from > value) : undefined;
	return upper && next > upper.from ? upper.from : next;
}

/** Whether `value` is a whole number of steps from `base`, allowing for binary rounding. */
function onStep(value: number, step: number, base: number): boolean {
	const steps = (value - base) / step;
	return Math.abs(steps - Math.round(steps)) < 1e-9;
}

/**
 * The message for the first constraint `value` breaks, worded by the locale, with numbers in its
 * format. `NaN` stands for text that is not a number. As in HTML, a fixed step counts from
 * `min`; bands of steps count from 0, so each value is a multiple of its band's step.
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
	if (step == null) return undefined;
	const size = stepAt(step, value);
	const base = typeof step === 'number' ? (min ?? 0) : 0;
	if (size > 0 && !onStep(value, size, base)) {
		return locale.t('stepMismatch', { step: format(size) });
	}
	return undefined;
}
