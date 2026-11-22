import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size, Variant } from '../../core/props/types.js';

/** The SegmentedControl props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface SegmentedControlDefaults {
	/**
	 * How the selected segment is painted: a raised surface by default. The track behind the
	 * options follows it: filled for `elevated`, `flat` and `tonal`; a hairline around the row with
	 * no fill for `outlined`; none for `text` and `plain`.
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
	/**
	 * A short text that the theme's Tooltip shows over the segment on hover and on keyboard focus,
	 * and screen readers read as its description, such as the full name of a short label:
	 * `{ value: 'en', label: 'EN', tooltip: 'English' }`. Touch has no hover, so give the full name
	 * to `aria-label` in `attributes` as well.
	 */
	tooltip?: string;
	/**
	 * More attributes for the segment's radio, such as `lang`, `title`, or an `aria-label` that
	 * says more than a short label: `{ 'aria-label': 'EN · English', lang: 'en' }`. A name
	 * should start with the label's words.
	 */
	attributes?: Omit<
		HTMLButtonAttributes,
		'type' | 'role' | 'disabled' | 'aria-checked' | 'onclick' | 'onfocus' | 'children'
	>;
}

/**
 * One choice among a few options, side by side, as a radio group with one tab stop. Name it
 * with `aria-label`.
 *
 * @example
 * <SegmentedControl
 *   aria-label="Chart range"
 *   options={[{ value: '1W', label: '1W' }, { value: '1M', label: '1M' }, { value: '1Y', label: '1Y' }]}
 *   bind:value={range}
 * />
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
		 * `automatic` picks an option as soon as the arrow keys reach it, as a radio group does;
		 * `manual` moves focus with the arrows and waits for Enter or Space, for a choice that changes
		 * the page, such as a language switch that goes to another address.
		 * @default 'automatic'
		 */
		activation?: 'automatic' | 'manual';
		/**
		 * Disables every option.
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Lets the options flow onto more lines when they do not fit, each as wide as its label,
		 * for many options, or labels with counts, in a narrow space. The selected one is painted
		 * in place instead of sliding, and every arrow key moves. Still one tab stop.
		 * @default false
		 */
		wrap?: boolean;
	}
>;
