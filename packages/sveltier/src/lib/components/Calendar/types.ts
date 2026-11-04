import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/** The days of the week, 0 for Sunday to 6 for Saturday, as `Date.getDay()` counts them. */
export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/** What every calendar takes: the days that can be chosen, and where the week starts. */
export interface DateLimits {
	/** The earliest day that can be chosen, as an ISO date (`YYYY-MM-DD`). */
	min?: string;
	/** The latest day that can be chosen, as an ISO date. */
	max?: string;
	/**
	 * Rules days out, such as weekends and holidays when a market is closed. Receives the ISO
	 * date. A ruled-out day can be reached with the keys, but not chosen.
	 */
	isDateDisabled?: (date: string) => boolean;
	/** The first day of the week, 0 Sunday to 6 Saturday. Defaults to the locale's. */
	firstDayOfWeek?: Weekday;
}

/**
 * A month on the page to choose a day from, as the APG date picker grid: the arrows move by a
 * day and a week, Home and End to the ends of the week, Page Up and Page Down by a month (with
 * Shift, a year), and Enter, Space or a click chooses. The value is an ISO date, `YYYY-MM-DD`,
 * which no time zone shifts.
 *
 * @example
 * <script lang="ts">
 * 	import { Calendar } from '@sveltier/ui';
 * 	let day = $state<string | null>('2026-10-26');
 * </script>
 *
 * <Calendar aria-label="Trading day" bind:value={day} isDateDisabled={(d) => [0, 6].includes(new Date(d).getUTCDay())} />
 */
export type CalendarProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	DateLimits & {
		/** The chosen day as an ISO date, or `null` for none. Bindable. */
		value?: string | null;
		/** Called with the ISO date the user chooses. */
		onchange?: (value: string) => void;
	}
>;
