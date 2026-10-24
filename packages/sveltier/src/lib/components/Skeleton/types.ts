import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Size } from '../../core/props/types.js';

/**
 * A placeholder in the shape of content that is still loading. Hidden from assistive
 * technology: mark the region that is loading with `aria-busy="true"` instead.
 */
export type SkeletonProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	{
		/**
		 * Lines of text, a golden rectangle that fills the width (an image, a chart), or a circle
		 * (an avatar).
		 * @default 'text'
		 */
		type?: 'text' | 'rect' | 'circle';
		/**
		 * Lines of text; the last of several is φ⁻¹ as wide.
		 * @default 1
		 */
		lines?: number;
		/**
		 * The diameter of a circle: the control height of the size.
		 * @default 'md'
		 */
		size?: Size;
	}
>;
