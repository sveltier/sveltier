import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { FieldError } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size } from '../../core/props/types.js';

/**
 * How a field's box is drawn, a subset of the shared variants: `outlined` (a border), `tonal`
 * (a wash with a rule under it), `elevated` (a surface with a shadow), `text` (only the rule)
 * and `plain` (nothing, for a field inside another component).
 */
export type FieldVariant = 'outlined' | 'tonal' | 'elevated' | 'text' | 'plain';

/** The Field props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface FieldDefaults {
	/**
	 * How the box is drawn.
	 * @default 'outlined'
	 */
	variant: FieldVariant;
	/**
	 * The accent of the focused field. An invalid field uses `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Height and text size, matching a Button of the same size.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height and padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
	/**
	 * Mutes the field and disables its control.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Field: FieldDefaults;
	}
}

/** What a Field passes to the control it wraps. Spread it onto the control element. */
export interface FieldControlAttributes {
	/** The id the label points at. */
	id: string;
	/** `sv-field__control`: fills the box and takes its text style. */
	class: string;
	/** The hint or the error, whichever is shown. */
	'aria-describedby': string | undefined;
	/** Set while the field shows an error. */
	'aria-invalid': true | undefined;
	required: boolean;
	disabled: boolean;
	readonly: boolean;
}

/** The props of a field's label, help and error, shared by every boxed field. */
export interface FieldContentProps {
	/** The visible label, linked to the control. Without it, name the control with `aria-label`. */
	label?: string;
	/** Help under the field. An error replaces it. */
	hint?: string;
	/**
	 * An error from outside the field, such as the server's answer: a message, a list of which
	 * the first is shown, or `true` for an invalid state described elsewhere.
	 */
	error?: FieldError;
	/** Content at the start of the box, usually an icon. */
	prepend?: Snippet;
	/** Content at the end of the box: an icon, a unit or a button. */
	append?: Snippet;
}

/**
 * A label, a box for a control, and its hint or error. Wrap your own control in it: the
 * children snippet receives the id, ARIA links and state to spread onto the control. Other
 * attributes go to the root element.
 */
export type FieldProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<FieldDefaults> &
		FieldContentProps & {
			/** The id of the control. Generated when not given. */
			id?: string | null;
			/**
			 * Adds an asterisk to the label. The control carries `required` itself.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The control can be read and focused but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** The control. Spread the attributes it receives onto it. */
			children: Snippet<[FieldControlAttributes]>;
		}
>;
