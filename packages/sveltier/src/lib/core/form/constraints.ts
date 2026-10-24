import type { LocaleInstance } from '../locale/locale.js';

/** The HTML constraints of a text control. */
export interface TextConstraints {
	required?: boolean | null;
	minlength?: number | null;
	maxlength?: number | null;
	pattern?: string | null;
	type?: string | null;
}

// The valid e-mail address of the HTML specification.
const EMAIL =
	/^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

// Compiled the way browsers compile the pattern attribute. Keys are the app's own patterns, not
// user input, so the cache is safe to share across server requests. An invalid pattern checks
// nothing, as in browsers.
const patterns = new Map<string, RegExp | null>();

function compile(pattern: string): RegExp | null {
	let regexp = patterns.get(pattern);
	if (regexp === undefined) {
		try {
			regexp = new RegExp(`^(?:${pattern})$`, 'v');
		} catch {
			regexp = null;
		}
		patterns.set(pattern, regexp);
	}
	return regexp;
}

/**
 * The message for the first HTML constraint that `value` breaks, worded by the locale. As in
 * HTML, an empty value can only break `required`. Lengths are counted here rather than read
 * from `validity`, which browsers only update after typing.
 */
export function textConstraintMessage(
	value: string,
	constraints: TextConstraints,
	t: LocaleInstance['t']
): string | undefined {
	const { required, minlength, maxlength, pattern, type } = constraints;
	if (value === '') return required ? t('required') : undefined;
	if (minlength != null && value.length < Number(minlength)) {
		return t('tooShort', { min: Number(minlength) });
	}
	if (maxlength != null && maxlength >= 0 && value.length > Number(maxlength)) {
		return t('tooLong', { max: Number(maxlength) });
	}
	if (type === 'email' && !EMAIL.test(value)) return t('typeEmail');
	if (type === 'url' && !URL.canParse(value)) return t('typeUrl');
	if (pattern && compile(pattern)?.test(value) === false) return t('patternMismatch');
	return undefined;
}
