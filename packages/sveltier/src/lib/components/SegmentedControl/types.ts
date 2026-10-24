import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size, Variant } from '../../core/props/types.js';

/** The SegmentedControl props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface SegmentedControlDefaults {
	/**
	 * How the selected segment is painted: a raised surface by default.
	 * @default 'elevated'
	 */
	variant: Variant;
	/**
	 * The colour of the selected segment.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * Height and text size.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height and padding, never the text.
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
		SegmentedControl: SegmentedControlDefaults;
	}
}

/** One choice of a SegmentedControl. */
export interface SegmentedControlOption<T extends string | number = string> {
	value: T;
	/** What the segment says. */
	label: string;
	disabled?: boolean;
}

/**
 * One choice among a few options, side by side, as a radio group with one tab stop. Name it
 * with `aria-label`.
 */
export type SegmentedControlProps<T extends string | number = string> = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<SegmentedControlDefaults> & {
		/** The choices, in order. */
		options: readonly SegmentedControlOption<T>[];
		/** The chosen value. Bindable. */
		value?: T;
		/** Called with the value the user picks. */
		onchange?: (value: T) => void;
		/**
		 * Disables every option.
		 * @default false
		 */
		disabled?: boolean;
	}
>;
