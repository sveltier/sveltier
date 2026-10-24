import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Size } from '../../core/props/types.js';

/**
 * An icon: SVG path data, or any icon of your own as `children`. Decorative unless it has a
 * `label`.
 */
export type IconProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	{
		/**
		 * SVG path data, filled with the current colour: the format of path-based icon sets such
		 * as Material Design Icons. Several shapes go in one string (`M… Z M… Z`).
		 */
		path?: string;
		/**
		 * The coordinate box of `path`.
		 * @default '0 0 24 24'
		 */
		viewBox?: string;
		/**
		 * The text size the icon is drawn at, φ^½ larger. Without it, the icon follows the text
		 * around it.
		 */
		size?: Size;
		/** The icon's colour. Without it, the icon takes the colour of the text around it. */
		color?: Color;
		/**
		 * A name for an icon that means something on its own, for assistive technology. Without
		 * it, the icon is decorative and hidden from it.
		 */
		label?: string;
		/** Any other icon (an `<svg>`, an icon component), sized and coloured like a path. */
		children?: Snippet;
	}
>;
