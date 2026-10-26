import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { DateLimits } from '../Calendar/types.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The DatePicker props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type DatePickerDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		DatePicker: DatePickerDefaults;
	}
}

/**
 * A date typed in the reader's own order (`10/26/2026`, `26.10.2026`, or ISO), or chosen in a
 * calendar that opens from the button at the end of the field. The value is an ISO date,
 * `YYYY-MM-DD`, which no time zone shifts. A two-digit year is read when the field is left, which
 * also writes the date in the locale's format; a form reset brings back the starting date.
 * `class` and `style` apply to the field; `id`, `ref` and other attributes go to the `<input>`.
 *
 * @example
 * <script lang="ts">
 * 	import { DatePicker } from '@sveltier/ui';
 * 	let day = $state<string | null>(null);
 * </script>
 *
 * <DatePicker label="Trade date" max="2026-12-31" required bind:value={day} />
 */
export type DatePickerProps = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	Partial<DatePickerDefaults> &
		FieldContentProps &
		DateLimits & {
			/** The date as an ISO date, or `null` when the field is empty. Bindable. */
			value?: string | null;
			/** Called with the ISO date the user enters or chooses, or `null` when they empty the field. */
			onchange?: (value: string | null) => void;
			/** What the empty field shows. Defaults to the locale's pattern, such as `mm/dd/yyyy`. */
			placeholder?: string;
			/** Checks run in order with the ISO date. The first message is shown. */
			rules?: readonly Rule<string>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * The field must not be empty. Adds an asterisk to the label.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The date can be read and copied but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** Submits the ISO date under this name in a form. */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
