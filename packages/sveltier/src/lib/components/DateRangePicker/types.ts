import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { DateLimits } from '../Calendar/types.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The DateRangePicker props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type DateRangePickerDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		DateRangePicker: DateRangePickerDefaults;
	}
}

/** A start and an end, as ISO dates; either is `null` while it is empty. */
export interface DateRange {
	start: string | null;
	end: string | null;
}

/**
 * A start and an end date in one field: each typed in the reader's own order, or both chosen in
 * a calendar that opens from the button at the end of the field. The first day chosen is the
 * start, the second the end; a day before the start starts again. Values are ISO dates,
 * `YYYY-MM-DD`. `class` and `style` apply to the field; `id`, `ref` and other attributes go to
 * the start's `<input>`.
 *
 * @example
 * <script lang="ts">
 * 	import { DateRangePicker } from '@sveltier/ui';
 * 	let start = $state<string | null>(null);
 * 	let end = $state<string | null>(null);
 * </script>
 *
 * <DateRangePicker label="Holding period" max="2026-12-31" bind:start bind:end />
 */
export type DateRangePickerProps = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	Partial<DateRangePickerDefaults> &
		FieldContentProps &
		DateLimits & {
			/** The first day, as an ISO date, or `null`. Bindable. */
			start?: string | null;
			/** The last day, as an ISO date, or `null`. Bindable. */
			end?: string | null;
			/** Called with both dates when the user changes either. */
			onchange?: (range: DateRange) => void;
			/** Checks run in order once both dates are there. The first message is shown. */
			rules?: readonly Rule<{ start: string; end: string }>[];
			/** When the message shows. Defaults to the form's setting, else `'blur'`. */
			validateOn?: ValidateOn;
			/**
			 * Both dates must be there. Adds an asterisk to the label.
			 * @default false
			 */
			required?: boolean;
			/**
			 * The dates can be read and copied but not changed.
			 * @default false
			 */
			readonly?: boolean;
			/**
			 * Submits the start and then the end under this name in a form, read with
			 * `FormData.getAll(name)`.
			 */
			name?: string;
			/** Inline style of the field's root element. */
			style?: string | null;
		}
>;
