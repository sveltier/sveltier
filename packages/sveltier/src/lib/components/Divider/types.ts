import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/** A hairline between groups of content: an `<hr>`, which assistive technology reads as a separator. */
export type DividerProps = ElementProps<
	HTMLHRElement,
	HTMLAttributes<HTMLHRElement>,
	{
		/**
		 * Runs top to bottom, between items in a row, and stretches to the row's height.
		 * @default false
		 */
		vertical?: boolean;
	}
>;
