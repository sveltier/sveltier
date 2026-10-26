import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';
import type { SelectItem } from '../Select/options.js';

/** The Combobox props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type ComboboxDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Combobox: ComboboxDefaults;
	}
}

/**
 * One value found by typing: the list under the field shows the items that match what is
 * typed, as the APG combobox with list autocomplete. The first match is pointed at, so a few
 * letters and Enter choose; the arrows move, and a click chooses too. Matching ignores case and
 * diacritics, so "ha noi" finds "Hà Nội". `class` and `style` apply to the field; `id`, `ref`
 * and other attributes go to the `<input>`.
 *
 * @example
 * <script lang="ts">
 * 	import { Combobox } from '@sveltier/ui';
 * 	let city = $state<string | null>(null);
 * </script>
 *
 * <Combobox
 * 	label="City"
 * 	items={[
 * 		{ value: 'hn', label: 'Hà Nội' },
 * 		{ value: 'hcm', label: 'Hồ Chí Minh' },
 * 		{ value: 'dn', label: 'Đà Nẵng' }
 * 	]}
 * 	bind:value={city}
 * />
 */
export type ComboboxProps<
	T extends string | number = string,
	I extends SelectItem<T> = SelectItem<T>
> = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	Partial<ComboboxDefaults> &
		FieldContentProps & {
			/**
			 * The choices, in order. Items of a `group` show together under its name. Items may
			 * carry more properties, which the `option` snippet receives.
			 */
			items: readonly I[];
			/** The chosen value, or `null` for none. Bindable. */
			value?: T | null;
			/** Called with the value the user chooses, or `null` when they empty the field. */
			onchange?: (value: T | null) => void;
			/**
			 * What is typed. Bindable, to search elsewhere as it changes: then pass `filter={false}`
			 * and the items found.
			 */
			query?: string;
			/**
			 * Which items match what is typed. By default every word typed must appear in the label
			 * or the description, ignoring case and diacritics. `false` shows the items as given.
			 */
			filter?: ((item: I, query: string) => boolean) | false;
			/**
			 * Items are on their way: the list says "Loading" while it has none.
			 * @default false
			 */
			loading?: boolean;
			/** What the field shows while it is empty. */
			placeholder?: string;
			/** An option's content, in place of its label and description. */
			option?: Snippet<[item: I]>;
			/** Checks run in order with the chosen value. The first message is shown. */
			rules?: readonly Rule<T>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * A value must be chosen. Adds an asterisk to the label.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The value can be seen but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** Submits the chosen value, not the typed text, under this name in a form. */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
