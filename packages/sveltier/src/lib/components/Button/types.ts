import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Size, Variant } from '../../core/props/types.js';

/** The Button props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ButtonDefaults {
	/**
	 * Visual weight.
	 * @default 'flat'
	 */
	variant: Variant;
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
	 * The colour the variant is painted with.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Corner rounding. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
	/**
	 * Takes the full width of its container.
	 * @default false
	 */
	block: boolean;
	/**
	 * A disabled button cannot be focused or pressed; a disabled link loses its `href`.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Button: ButtonDefaults;
	}
}

type ButtonOwnProps = Partial<ButtonDefaults> & {
	/**
	 * The element to render. Defaults to `'a'` when `href` is given, otherwise `'button'`.
	 */
	as?: 'button' | 'a';
	/**
	 * Square, for a single icon as the content. Give it an `aria-label`.
	 * @default false
	 */
	icon?: boolean;
	/**
	 * Shows a spinner and ignores presses, while the button keeps focus and its label for
	 * screen readers, which also hear that it is loading.
	 * @default false
	 */
	loading?: boolean;
	/** Content before the label, usually an icon. */
	prepend?: Snippet;
	/** Content after the label, usually an icon. */
	append?: Snippet;
	/** The label. */
	children?: Snippet;
};

/**
 * A button, or a link that looks like one (`href`). Every other attribute of `<button>` and
 * `<a>` passes through to the element.
 */
export type ButtonProps = ElementProps<
	HTMLButtonElement | HTMLAnchorElement,
	HTMLButtonAttributes & HTMLAnchorAttributes,
	ButtonOwnProps
>;
