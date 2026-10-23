import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size, Variant } from '../../core/props/types.js';

/** The Chip props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ChipDefaults {
	/**
	 * Visual weight. A selected chip is `flat`.
	 * @default 'tonal'
	 */
	variant: Variant;
	/**
	 * Height and text size.
	 * @default 'sm'
	 */
	size: Size;
	/**
	 * Multiplies the height and padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * The colour the variant is painted with.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * Corner rounding. `true` keeps the pill.
	 * @default true
	 */
	rounded: Rounded;
	/**
	 * A disabled chip cannot be pressed; a disabled link loses its `href`.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Chip: ChipDefaults;
	}
}

/**
 * A compact label: a tag (optionally `closable`), a filter that toggles (`selected`), an
 * action (`onclick`) or a link (`href`).
 */
export type ChipProps = ElementProps<
	HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement,
	HTMLAttributes<HTMLSpanElement> & HTMLButtonAttributes & HTMLAnchorAttributes,
	Partial<ChipDefaults> & {
		/**
		 * Makes the chip a toggle button (`aria-pressed`) that flips it when pressed: a filter.
		 * Bindable. Shows a check while selected.
		 */
		selected?: boolean;
		/**
		 * Adds a button that removes the chip by calling `onclose`. Only for chips that are not
		 * themselves buttons or links.
		 * @default false
		 */
		closable?: boolean;
		/** The name of the close button, such as `Remove Euro`. Defaults to the locale's `close`. */
		closeLabel?: string;
		/** Called by the close button. */
		onclose?: () => void;
		/** Content before the label, usually an icon or an avatar. */
		prepend?: Snippet;
		/** Content after the label. */
		append?: Snippet;
		/** The label. */
		children?: Snippet;
	}
>;
