import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size, Variant } from '../../core/props/types.js';

/**
 * The ButtonGroup props that `DefaultsProvider` and `UIProvider` can set for a subtree. The
 * group passes them on to its Buttons.
 */
export interface ButtonGroupDefaults {
	/**
	 * The variant of the Buttons.
	 * @default 'outlined'
	 */
	variant: Variant;
	/**
	 * The size of the Buttons.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * The density of the Buttons.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * The colour of the Buttons.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The rounding of the group's outer corners; inner corners are square.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		ButtonGroup: ButtonGroupDefaults;
	}
}

/**
 * Buttons joined into one control: shared borders, square inner corners, and the same
 * variant, size, density and colour unless a Button says otherwise. Give it an `aria-label`.
 */
export type ButtonGroupProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<ButtonGroupDefaults> & {
		/** The Buttons. */
		children?: Snippet;
	}
>;
