import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';
import type { ChoiceContentProps } from '../Choice/types.js';

/** The Checkbox props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface CheckboxDefaults {
	/**
	 * The colour of the checked box. An invalid checkbox uses `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The size of the box and the label text.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height of the row, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Mutes the checkbox and disables its input.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Checkbox: CheckboxDefaults;
	}
}

type CheckboxOwnProps = Partial<CheckboxDefaults> &
	ChoiceContentProps & {
		/**
		 * Whether the box is checked. Bindable.
		 * @default false
		 */
		checked?: boolean;
		/**
		 * Shows a dash for a state that is neither checked nor unchecked, such as a "select all"
		 * box over a partly selected list. A press clears it. Bindable.
		 * @default false
		 */
		indeterminate?: boolean;
		/**
		 * What the form submits under `name` while the box is checked.
		 * @default 'on'
		 */
		value?: string;
		/** Checks run in order after `required`, with the checked state. The first message is shown. */
		rules?: readonly Rule<boolean>[];
		/** When the message shows. Defaults to the form's setting, else `'blur'`. */
		validateOn?: ValidateOn;
		/**
		 * The box must be checked, as for accepting terms. Adds an asterisk to the label.
		 * @default false
		 */
		required?: boolean;
		/** Inline style of the checkbox's root element. */
		style?: string | null;
	};

/**
 * A box that is checked or not, with its label beside it: the platform's own checkbox, drawn in
 * the theme. `class` and `style` apply to the root; `id`, `ref`, `name` and every other attribute
 * go to the `<input type="checkbox">`. The label is the press target, at least 24px tall.
 *
 * @example
 * <Checkbox label="Email me a receipt" name="receipt" bind:checked={receipt} />
 *
 * <Checkbox name="terms" required bind:checked={accepted}>
 *   {#snippet label()}I accept the <a href="/terms">terms of service</a>{/snippet}
 * </Checkbox>
 */
export type CheckboxProps = ElementProps<
	HTMLInputElement,
	Omit<HTMLInputAttributes, 'type' | 'children'>,
	CheckboxOwnProps
>;
