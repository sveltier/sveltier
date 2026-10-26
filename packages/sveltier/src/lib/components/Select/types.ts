import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';
import type { SelectItem } from './options.js';

export type { SelectItem };

/** The Select props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type SelectDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Select: SelectDefaults;
	}
}

/**
 * One value chosen from a list that opens under the field, as the APG select-only combobox:
 * the field keeps focus, the arrows move through the options, typing jumps to a label, and
 * Enter or a click chooses. Options can be grouped and drawn your own way. `class` and `style`
 * apply to the field; `id`, `ref` and other attributes go to the combobox.
 *
 * For the platform's own picker, as phones show it, use NativeSelect; to search a long list,
 * Combobox.
 *
 * @example
 * <script lang="ts">
 * 	import { Select } from '@sveltier/ui';
 * 	let market = $state<string | null>(null);
 * </script>
 *
 * <Select
 * 	label="Market"
 * 	items={[
 * 		{ value: 'btc-usdt', label: 'BTC/USDT', group: 'Binance' },
 * 		{ value: 'eth-usdt', label: 'ETH/USDT', group: 'Binance' },
 * 		{ value: 'btc-usd', label: 'BTC/USD', group: 'Coinbase' }
 * 	]}
 * 	bind:value={market}
 * />
 */
export type SelectProps<
	T extends string | number = string,
	I extends SelectItem<T> = SelectItem<T>
> = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<SelectDefaults> &
		FieldContentProps & {
			/**
			 * The choices, in order. Items of a `group` show together under its name. Items may
			 * carry more properties, which the `option` and `selection` snippets receive.
			 */
			items: readonly I[];
			/** The chosen value, or `null` for none. Bindable. */
			value?: T | null;
			/** Called with the value the user chooses. */
			onchange?: (value: T) => void;
			/** What the field shows while nothing is chosen. */
			placeholder?: string;
			/** An option's content, in place of its label and description. */
			option?: Snippet<[item: I]>;
			/** The chosen item as the field shows it, in place of its label. */
			selection?: Snippet<[item: I]>;
			/** Checks run in order with the chosen value. The first message is shown. */
			rules?: readonly Rule<T>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * A value must be chosen. Adds an asterisk to the label. A plain `<form>` does not check
			 * it; a Sveltier Form does.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The value can be seen but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** Submits the value under this name in a form. */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
