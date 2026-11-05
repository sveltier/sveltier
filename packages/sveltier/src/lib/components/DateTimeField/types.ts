import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Weekday } from '../Calendar/types.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The DateTimeField props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type DateTimeFieldDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		DateTimeField: DateTimeFieldDefaults;
	}
}

/**
 * A date and a time of day in one field: the date typed in the reader's own order or chosen in a
 * calendar, the time typed as a TimeField's is. The value is `YYYY-MM-DDTHH:mm`, local and with
 * no time zone, as `<input type="datetime-local">` gives it; it is set once both are there.
 * `class` and `style` apply to the field; `id`, `ref` and other attributes go to the date's
 * `<input>`.
 *
 * @example
 * <script lang="ts">
 * 	import { DateTimeField } from '@sveltier/ui';
 * 	let opened = $state<string | null>(null);
 * </script>
 *
 * <DateTimeField label="Opened" max="2026-12-31T23:59" required bind:value={opened} />
 */
export type DateTimeFieldProps = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	Partial<DateTimeFieldDefaults> &
		FieldContentProps & {
			/** The date and time as `YYYY-MM-DDTHH:mm`, or `null` when the field is empty. Bindable. */
			value?: string | null;
			/** Called with the value the user enters or chooses, or `null` when they empty both parts. */
			onchange?: (value: string | null) => void;
			/** The earliest date and time, as `YYYY-MM-DDTHH:mm`. */
			min?: string;
			/** The latest date and time, as `YYYY-MM-DDTHH:mm`. */
			max?: string;
			/**
			 * Rules days out, such as weekends and holidays when a market is closed. Receives the
			 * ISO date. A ruled-out day can be reached in the calendar, but not chosen.
			 */
			isDateDisabled?: (date: string) => boolean;
			/** The first day of the calendar's week, 0 Sunday to 6 Saturday. Defaults to the locale's. */
			firstDayOfWeek?: Weekday;
			/**
			 * Minutes between the times that can be entered, counted from midnight. The arrow keys in
			 * the time move by it.
			 * @default 1
			 */
			step?: number;
			/** Checks run in order with the whole value. The first message is shown. */
			rules?: readonly Rule<string>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * The date and the time must be there. Adds an asterisk to the label.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The value can be read and copied but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/** Submits the value, `YYYY-MM-DDTHH:mm`, under this name in a form. */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
