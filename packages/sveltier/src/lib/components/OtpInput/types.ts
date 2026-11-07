import type { HTMLInputAttributes } from 'svelte/elements';
import type { FieldError, Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size } from '../../core/props/types.js';

/** The OtpInput props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface OtpInputDefaults {
	/**
	 * The accent of the box at the caret. An invalid code uses `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The height of each box and the size of its character, matching a Button of the same size.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height of the boxes, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding of each box. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
	/**
	 * Mutes the boxes and disables the input.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		OtpInput: OtpInputDefaults;
	}
}

export const OTP_TYPES = ['numeric', 'alphanumeric'] as const;

/** What a code is made of: digits, or letters and digits (uppercased as they are typed). */
export type OtpType = (typeof OTP_TYPES)[number];

type OtpInputOwnProps = Partial<OtpInputDefaults> & {
	/** The code typed so far, never longer than `length`. Bindable. */
	value?: string;
	/**
	 * Called with the code when the user leaves the field after changing it; not when `value` is
	 * set. `oncomplete` comes as soon as every box is filled.
	 */
	onchange?: (value: string) => void;
	/**
	 * How many characters the code has: one box each.
	 * @default 6
	 */
	length?: number;
	/**
	 * What the code is made of. It picks the keyboard; other characters are dropped, so a pasted
	 * "123-456" becomes "123456".
	 * @default 'numeric'
	 */
	type?: OtpType;
	/** Called with the code when the user fills the last box, for example to submit it. */
	oncomplete?: (value: string) => void;
	/** The visible label, linked to the input. Without it, name the input with `aria-label`. */
	label?: string;
	/** Help under the boxes, such as where the code was sent. An error replaces it. */
	hint?: string;
	/**
	 * An error from outside the field, such as the server's answer: a message, a list of which
	 * the first is shown, or `true` for an invalid state described elsewhere.
	 */
	error?: FieldError;
	/** Checks run in order once the code is complete. The first message is shown. */
	rules?: readonly Rule<string>[];
	/** When the message shows. Defaults to the form's setting, else `'blur'`. */
	validateOn?: ValidateOn;
	/**
	 * The code must not be empty. Adds an asterisk to the label.
	 * @default false
	 */
	required?: boolean;
	/** Inline style of the field's root element. */
	style?: string | null;
};

/**
 * A one-time code, such as a two-factor sign-in code, shown one character per box. It is a
 * single `<input autocomplete="one-time-code">` under the boxes, so the code the phone offers
 * from a text message, a paste of the whole code, typing and Backspace all work, and screen
 * readers hear one field. A code started but not finished is invalid. `class` and `style` apply
 * to the root; `id`, `ref`, `name` and every other attribute go to the `<input>`.
 *
 * @example
 * <OtpInput
 *   label="Verification code"
 *   name="code"
 *   hint="Sent to •••• 4821"
 *   required
 *   error={form?.errors?.code}
 *   oncomplete={() => formElement.requestSubmit()}
 *   bind:value={code}
 * />
 */
export type OtpInputProps = ElementProps<
	HTMLInputElement,
	Omit<
		HTMLInputAttributes,
		'type' | 'children' | 'required' | 'maxlength' | 'minlength' | 'inputmode'
	>,
	OtpInputOwnProps
>;
