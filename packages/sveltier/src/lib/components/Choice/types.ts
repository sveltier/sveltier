import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { FieldError } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';

/** The props of a choice's label, help and error, shared by Checkbox and Switch. */
export interface ChoiceContentProps {
	/**
	 * The label beside the control: text, or a snippet when it holds a link. A press anywhere on
	 * it toggles the control. Without it, name the control with `aria-label`.
	 */
	label?: string | Snippet;
	/** Help under the label. An error replaces it. */
	hint?: string;
	/**
	 * An error from outside the control, such as the server's answer: a message, a list of which
	 * the first is shown, or `true` for an invalid state described elsewhere.
	 */
	error?: FieldError;
}

/** What a Choice passes to the control it lays out. Spread it onto the `<input>`. */
export interface ChoiceControlAttributes {
	/** The id the hint and the error are named after. */
	id: string;
	/** The hint or the error, whichever is shown. */
	'aria-describedby': string | undefined;
	/** Set while the choice shows an error. */
	'aria-invalid': true | undefined;
	required: boolean;
	disabled: boolean;
}

/** A control beside its label, with a hint or an error under them. Internal. */
export type ChoiceProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Omit<ChoiceContentProps, 'error'> & {
		/** The id of the control. Generated when not given. */
		id?: string | null;
		/** What the choice shows: a message, `true` for an invalid state without one, or `false`. */
		error?: string | boolean;
		/** Adds an asterisk to the label. */
		required?: boolean;
		/** Mutes the choice. The control carries `disabled` itself. */
		disabled?: boolean;
		/** The control, drawn at the start of the label. */
		children: Snippet<[ChoiceControlAttributes]>;
	}
>;
