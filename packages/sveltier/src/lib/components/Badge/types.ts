import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color } from '../../core/props/types.js';

/** The Badge props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface BadgeDefaults {
	/**
	 * The badge's fill.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Counts above it show as `max+`.
	 * @default 99
	 */
	max: number;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Badge: BadgeDefaults;
	}
}

/**
 * A count or a dot pinned to the top end corner of its content, or standing alone in a line
 * when it has none. A count of 0 hides it.
 */
export type BadgeProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	Partial<BadgeDefaults> & {
		/** What the badge says: usually a count. */
		content?: number | string;
		/**
		 * A dot instead of the content.
		 * @default false
		 */
		dot?: boolean;
		/**
		 * What the content counts, read after it by screen readers: `unread messages` reads
		 * "3 unread messages". With `dot`, the whole announcement. With an `id`, this text has
		 * the id `{id}-label`, for the `aria-describedby` of a button the badge is pinned to.
		 */
		label?: string;
		/** The content the badge is pinned to. */
		children?: Snippet;
	}
>;
