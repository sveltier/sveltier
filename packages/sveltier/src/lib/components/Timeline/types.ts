import type { Snippet } from 'svelte';
import type { HTMLOlAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density } from '../../core/props/types.js';

/** The Timeline props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface TimelineDefaults {
	/**
	 * The colour of the markers, for events that do not name their own.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * Multiplies the space between events, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Timeline: TimelineDefaults;
	}
}

/** One event. Extra fields are kept, and the `item` snippet receives them typed. */
export interface TimelineItem {
	/** What happened, such as "Order filled". */
	title: string;
	/**
	 * When: a Date, a timestamp in milliseconds, or an ISO string. A string that is not a date is
	 * shown as written.
	 */
	time?: Date | number | string;
	/** A line under the title. */
	description?: string;
	/** The colour of its marker, such as `'success'` for a fill or `'error'` for a rejection. */
	color?: Color;
	/** Expected, not happened yet: a hollow marker and muted text, read as "Pending". */
	pending?: boolean;
	/** Keeps the event's element when the list changes. Without it, events are kept by position. */
	id?: string | number;
}

/**
 * What happened to something, in time: an ordered list of events, each with a marker, a title,
 * a time and a description, joined by a line. Events show in the order given. Name it with
 * `aria-label` or `aria-labelledby`; `class`, `style`, `ref` and other attributes go to the
 * `<ol>`.
 *
 * @example
 * <script>
 * 	import { Timeline } from '@sveltier/ui';
 * </script>
 *
 * <Timeline
 * 	aria-label="Order history"
 * 	items={[
 * 		{ title: 'Order placed', time: '2026-11-07T09:30:00Z', description: 'Buy 300 VNM at 61.20' },
 * 		{ title: 'Partly filled', time: '2026-11-07T09:31:12Z', description: '120 of 300' },
 * 		{ title: 'Filled', time: '2026-11-07T09:34:05Z', color: 'success' },
 * 		{ title: 'Settles', time: '2026-11-09', pending: true }
 * 	]}
 * />
 */
export type TimelineProps<T extends TimelineItem = TimelineItem> = ElementProps<
	HTMLOListElement,
	HTMLOlAttributes,
	Partial<TimelineDefaults> & {
		/** The events, in the order they show. */
		items: readonly T[];
		/**
		 * Intl.DateTimeFormat options for the times, in the locale and its time zone.
		 * @default { dateStyle: 'medium', timeStyle: 'short' }
		 */
		timeFormat?: Intl.DateTimeFormatOptions;
		/**
		 * Shows times as "3 hours ago", with the full date on hover.
		 * @default false
		 */
		relative?: boolean;
		/** An event's content, in place of its title, time and description. */
		item?: Snippet<[item: T]>;
	}
>;
