import type { HTMLFieldsetAttributes } from 'svelte/elements';
import type { FieldError, Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';

/** The RadioGroup props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface RadioGroupDefaults {
	/**
	 * The colour of the chosen radio. An invalid group uses `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The size of the radios and their labels.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height of each row, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Mutes the group and disables every radio in it.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		RadioGroup: RadioGroupDefaults;
	}
}

/** One choice of a RadioGroup. */
export interface RadioGroupOption<T extends string | number = string> {
	/** The value the group binds to when this radio is chosen. */
	value: T;
	/** What the radio says. */
	label: string;
	/** Help under the label, read out with the radio. */
	hint?: string;
	disabled?: boolean;
}

type RadioGroupOwnProps<T extends string | number> = Partial<RadioGroupDefaults> & {
	/** The choices, in order. */
	options: readonly RadioGroupOption<T>[];
	/** The chosen value, or `null` for none. Bindable. */
	value?: T | null;
	/** The question the radios answer, as the group's legend. Without it, use `aria-label`. */
	label?: string;
	/** Help under the radios. An error replaces it. */
	hint?: string;
	/**
	 * An error from outside the group, such as the server's answer: a message, a list of which
	 * the first is shown, or `true` for an invalid state described elsewhere.
	 */
	error?: FieldError;
	/** Checks run in order after `required`, with the chosen value. The first message is shown. */
	rules?: readonly Rule<T>[];
	/** When the message shows. Defaults to the form's setting, else `'blur'`. */
	validateOn?: ValidateOn;
	/**
	 * A choice must be made. Adds an asterisk to the legend.
	 * @default false
	 */
	required?: boolean;
	/**
	 * Lays the radios side by side, wrapping when they run out of room.
	 * @default false
	 */
	inline?: boolean;
	/** The name the radios submit their value under. Generated when not given. */
	name?: string;
};

/**
 * One choice among a few options, all shown: native radios sharing a name in a `<fieldset>`,
 * whose `<legend>` is the label. The arrow keys move the choice, as the platform does. `class`,
 * `style`, `ref` and other attributes go to the `<fieldset>`. For many options, use a
 * NativeSelect.
 *
 * @example
 * <RadioGroup
 *   label="Pay out"
 *   name="payout"
 *   required
 *   options={[
 *     { value: 'daily', label: 'Every day' },
 *     { value: 'weekly', label: 'Every Monday', hint: 'Fewer, larger transfers' }
 *   ]}
 *   bind:value={payout}
 * />
 */
export type RadioGroupProps<T extends string | number = string> = ElementProps<
	HTMLFieldSetElement,
	Omit<HTMLFieldsetAttributes, 'children'>,
	RadioGroupOwnProps<T>
>;
