import type { HTMLSelectAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The NativeSelect props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type NativeSelectDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		NativeSelect: NativeSelectDefaults;
	}
}

/** One choice of a NativeSelect. */
export interface NativeSelectOption<T extends string | number = string> {
	/** The value, never the empty string, which stands for no choice. */
	value: T;
	/** What the option says. */
	label: string;
	disabled?: boolean;
}

/**
 * One choice from a list, as the platform's own `<select>` in a Field: the phone's picker and the
 * browser's keyboard behaviour come for free. `class` and `style` apply to the field; `id`, `ref`,
 * `name` and other attributes go to the `<select>`. The end of the box holds its arrow, so there
 * is no `append`.
 *
 * @example
 * <NativeSelect
 *   label="Country"
 *   name="country"
 *   placeholder="Choose a country"
 *   required
 *   options={[
 *     { value: 'gb', label: 'United Kingdom' },
 *     { value: 'vn', label: 'Vietnam' }
 *   ]}
 *   bind:value={country}
 * />
 */
export type NativeSelectProps<T extends string | number = string> = ElementProps<
	HTMLSelectElement,
	HTMLSelectAttributes,
	Partial<NativeSelectDefaults> &
		Omit<FieldContentProps, 'append'> & {
			/** The choices, in order. */
			options: readonly NativeSelectOption<T>[];
			/** The chosen value, or `null` for none. Bindable. */
			value?: T | null;
			/** A first option that stands for no choice, such as "Choose a country". */
			placeholder?: string;
			/** Checks run in order after `required`, with the chosen value. The first message is shown. */
			rules?: readonly Rule<T>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * A choice must be made. Adds an asterisk to the label, and the placeholder cannot be chosen
			 * again once the user has picked something.
			 * @default false
			 */
			required?: boolean;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
