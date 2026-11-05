import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The TimeField props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type TimeFieldDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		TimeField: TimeFieldDefaults;
	}
}

/**
 * A time of day, typed as a person writes it (`9:30`, `0930`, `9:30 pm`) and written back in the
 * locale's format (`09:30 PM` in en-US, `21:30` in en-GB). The value is `HH:mm` on the 24-hour
 * clock, as `<input type="time">` gives it. The input is a spinbutton: ArrowUp and ArrowDown move
 * by `step` minutes, Page Up and Page Down by an hour. `class` and `style` apply to the field;
 * `id`, `ref` and other attributes go to the `<input>`.
 *
 * @example
 * <script lang="ts">
 * 	import { TimeField } from '@sveltier/ui';
 * 	let opens = $state<string | null>('09:30');
 * </script>
 *
 * <TimeField label="Market opens" min="08:00" max="18:00" step={15} bind:value={opens} />
 */
export type TimeFieldProps = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	Partial<TimeFieldDefaults> &
		FieldContentProps & {
			/** The time as `HH:mm`, or `null` when the field is empty. Bindable. */
			value?: string | null;
			/** Called with the time the user enters, as `HH:mm`, or `null` when they empty the field. */
			onchange?: (value: string | null) => void;
			/** The earliest time, as `HH:mm`. */
			min?: string;
			/** The latest time, as `HH:mm`. */
			max?: string;
			/**
			 * Minutes between the times that can be entered, counted from `min`, else from midnight.
			 * The arrow keys move by it.
			 * @default 1
			 */
			step?: number;
			/** What the empty field shows. Defaults to the locale's pattern, such as `hh:mm AM`. */
			placeholder?: string;
			/** Checks run in order with the time, `HH:mm`. The first message is shown. */
			rules?: readonly Rule<string>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * The field must not be empty. Adds an asterisk to the label.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The time can be read and copied but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** Submits the time, `HH:mm`, under this name in a form. */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
