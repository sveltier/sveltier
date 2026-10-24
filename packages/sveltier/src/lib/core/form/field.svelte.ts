import type { FieldError, Rule, ValidateOn } from './types.js';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface FieldOptions<T> {
	/** The current value. */
	value: () => T;
	/** Whether a value counts as empty. Rules do not run on an empty value. */
	empty: (value: T) => boolean;
	/** The control's own checks (`required` and the HTML constraints): a message or undefined. */
	check: (value: T) => string | undefined;
	rules: () => readonly Rule<T>[] | null | undefined;
	error: () => FieldError | undefined;
	validateOn: () => ValidateOn | null | undefined;
	/** The native control, kept in step with `setCustomValidity()`. */
	control: () => Control | null | undefined;
}

export interface FieldState {
	/**
	 * What the field shows: the outside error, else its own message once shown; `true` for an
	 * invalid state without a message, `false` when valid.
	 */
	readonly error: string | boolean;
	/** Call when the user changes the value. */
	changed(): void;
	/** Call when focus leaves the field. */
	left(): void;
}

/** A FieldError as a message, `true` for invalid without one, or `false`. */
export function readError(error: FieldError | undefined): string | boolean {
	if (typeof error === 'string') return error || false;
	if (Array.isArray(error)) return (error as readonly string[])[0] || false;
	return error === true;
}

/**
 * The validation of one field. Its message is always derived from the current value; the
 * timing (`validateOn`) only decides when it is shown. Call during component initialisation.
 */
export function createField<T>(options: FieldOptions<T>): FieldState {
	let shown = $state(false);
	let dirty = false;

	// First problem: the control's own checks, then the rules, which skip empty values.
	const problem = $derived.by(() => {
		const value = options.value();
		const own = options.check(value);
		if (own !== undefined || options.empty(value)) return own;
		for (const rule of options.rules() ?? []) {
			const result = rule(value);
			if (result !== true) return result;
		}
		return undefined;
	});
	const outside = $derived(readError(options.error()));
	const mode = $derived(options.validateOn() ?? 'blur');

	// A plain <form> refuses to submit with the same words. Errors from outside are left out,
	// so a server's answer never blocks submitting again.
	$effect(() => {
		options.control()?.setCustomValidity(problem ?? '');
	});

	return {
		get error() {
			if (typeof outside === 'string') return outside;
			return (shown && problem) || outside;
		},
		changed() {
			dirty = true;
			if (mode === 'input') shown = true;
		},
		left() {
			if (dirty && mode !== 'submit') shown = true;
		}
	};
}
