import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Rounded, Size, Variant } from '../../core/props/types.js';

/** The Avatar props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AvatarDefaults {
	/**
	 * Width and height: the control height of the size.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * How the fallback is painted.
	 * @default 'tonal'
	 */
	variant: Variant;
	/**
	 * The colour of the fallback.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * Corner rounding.
	 * @default 'full'
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Avatar: AvatarDefaults;
	}
}

/**
 * A picture of a person or an account: an image, or initials or an icon when there is none
 * or it fails to load.
 */
export type AvatarProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	Partial<AvatarDefaults> & {
		/** The image. */
		src?: string;
		/**
		 * Who or what the avatar shows, for screen readers. Leave it out when a name is shown next
		 * to the avatar: it is then decorative and hidden from them.
		 */
		alt?: string;
		/** Initials or an icon, shown while there is no image or it failed to load. */
		children?: Snippet;
	}
>;
