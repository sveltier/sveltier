import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';
import type { ChoiceContentProps } from '../Choice/types.js';

/** The Switch props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface SwitchDefaults {
	/**
	 * The colour of the track while on. An invalid switch uses `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The size of the switch and the label text.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height of the row, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Mutes the switch and disables its input.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Switch: SwitchDefaults;
	}
}

type SwitchOwnProps = Partial<SwitchDefaults> &
	ChoiceContentProps & {
		/**
		 * Whether the switch is on. Bindable.
		 * @default false
		 */
		checked?: boolean;
		/**
		 * What the form submits under `name` while the switch is on.
		 * @default 'on'
		 */
		value?: string;
		/** Checks run in order after `required`, with the on state. The first message is shown. */
		rules?: readonly Rule<boolean>[];
		/** When the message shows. Defaults to the form's setting, else `'blur'`. */
		validateOn?: ValidateOn;
		/**
		 * The switch must be on. Adds an asterisk to the label.
		 * @default false
		 */
		required?: boolean;
		/** Inline style of the switch's root element. */
		style?: string | null;
	};

/**
 * A setting that is on or off, with its label beside it: a native checkbox with
 * `role="switch"`, drawn as a track and a thumb. `class` and `style` apply to the root; `id`,
 * `ref`, `name` and every other attribute go to the `<input>`. Use it for a setting that takes
 * effect at once; for a choice submitted with a form, use a Checkbox.
 *
 * @example
 * <Switch label="Sign in with biometrics" bind:checked={biometrics} />
 */
export type SwitchProps = ElementProps<
	HTMLInputElement,
	Omit<HTMLInputAttributes, 'type' | 'role' | 'children'>,
	SwitchOwnProps
>;
