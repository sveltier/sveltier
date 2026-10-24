import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Variant } from '../../core/props/types.js';

/** The Card props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface CardDefaults {
	/**
	 * Visual weight: a raised surface by default.
	 * @default 'elevated'
	 */
	variant: Variant;
	/**
	 * The colour the variant is painted with. Neutral cards use the theme's surface, text and
	 * border colours.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * Multiplies the padding and the space between sections.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Card: CardDefaults;
	}
}

/**
 * A surface that groups content about one thing: a header, the content and actions. Links
 * and buttons inside it are what is clickable, not the card.
 */
export type CardProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<CardDefaults> & {
		/** The title, in the header. */
		title?: string;
		/** A line under the title. */
		subtitle?: string;
		/**
		 * Makes the title a heading of this level (`<h2>`, `<h3>`…), so it is in the page's
		 * outline. Without it the title is styled text.
		 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** Content before the title, such as an avatar or an icon. */
		prepend?: Snippet;
		/** Content after the title, such as a menu button. */
		append?: Snippet;
		/** Buttons or links at the bottom. */
		actions?: Snippet;
		/** The content. */
		children?: Snippet;
	}
>;
