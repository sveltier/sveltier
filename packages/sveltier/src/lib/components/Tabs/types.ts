import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';

/** The Tabs props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface TabsDefaults {
	/**
	 * The colour of the selected tab and its underline.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Height and text size of the tabs.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height and padding of the tabs, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Tabs share the full width equally.
	 * @default false
	 */
	grow: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Tabs: TabsDefaults;
	}
}

/** One tab. */
export interface TabsItem<T extends string | number = string> {
	value: T;
	/** What the tab says. */
	label: string;
	disabled?: boolean;
	/**
	 * Makes the tab a link to another page. Tabs with links are a navigation between pages
	 * (`<nav>`), each tab a stop in the tab order, the one of `value` marked
	 * `aria-current="page"`, and no panel: the page is the content. Set `value` from the route.
	 */
	href?: string;
}

/**
 * Tabs and the panel of the selected one. Name the tab list with `aria-label` or
 * `aria-labelledby`, which go to it.
 *
 * @example
 * <Tabs
 *   aria-label="Account"
 *   items={[{ value: 'overview', label: 'Overview' }, { value: 'activity', label: 'Activity' }]}
 *   bind:value={section}
 * >
 *   {#snippet panel(item)}<AccountSection name={item.value} />{/snippet}
 * </Tabs>
 *
 * <!-- Links between pages, the current one from the route. -->
 * <Tabs
 *   aria-label="Learn"
 *   items={[{ value: 'lessons', label: 'Lessons', href: '/learn/lessons' }, { value: 'lab', label: 'Lab', href: '/learn/lab' }]}
 *   value={page.url.pathname.split('/')[2]}
 * />
 */
export type TabsProps<T extends string | number = string> = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<TabsDefaults> & {
		/** The tabs, in order. */
		items: readonly TabsItem<T>[];
		/** The selected tab. Bindable; the first enabled tab when not set. */
		value?: T;
		/** Called with the value of the tab the user selects. */
		onchange?: (value: T) => void;
		/**
		 * `automatic` selects a tab as soon as the arrow keys reach it; `manual` waits for Enter or
		 * Space, for panels that are slow to show.
		 * @default 'automatic'
		 */
		activation?: 'automatic' | 'manual';
		/** The content of the selected tab's panel. */
		panel?: Snippet<[TabsItem<T>]>;
		/**
		 * Fills the height the Tabs are given, as a full-height panel does: the tab list stays
		 * put and the selected panel takes the rest. The panel's last child stretches into it, so
		 * a Table there scrolls under its header while filters above it stay; anything taller
		 * scrolls the panel. Give the Tabs their height (`block-size`, or `flex: 1` in a column).
		 * @default false
		 */
		fill?: boolean;
	}
>;
