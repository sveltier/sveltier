import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLLiAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density } from '../../core/props/types.js';

/** The List props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ListDefaults {
	/**
	 * Multiplies the height and padding of its items.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * The colour of the active item.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Rounded rows set in from the edges, for navigation.
	 * @default false
	 */
	nav: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		List: ListDefaults;
	}
}

/** A list of rows: `ListItem`s. Density and colour are set here, for every item. */
export type ListProps = ElementProps<
	HTMLUListElement,
	HTMLAttributes<HTMLUListElement>,
	Partial<ListDefaults> & {
		/** The `ListItem`s. */
		children?: Snippet;
	}
>;

/**
 * A row of a `List`. With `href` it is a link and with `onclick` a button, filling the row;
 * `append` stays outside it, so it can hold controls of its own.
 */
export type ListItemProps = ElementProps<
	HTMLLIElement,
	HTMLLiAttributes,
	{
		/** The main line. */
		title?: string;
		/** A second line, under the title. */
		subtitle?: string;
		/** Makes the row a link. */
		href?: string;
		/** Where a link opens, as on `<a>`. */
		target?: HTMLAnchorAttributes['target'];
		/** The relationship of a link, as on `<a>`. */
		rel?: string;
		/** Makes the row a button that calls this. */
		onclick?: (event: MouseEvent) => void;
		/**
		 * The current page or the selected row: tinted in the list's colour, and
		 * `aria-current="page"` on a link.
		 * @default false
		 */
		active?: boolean;
		/**
		 * A disabled row cannot be pressed; a disabled link loses its `href`.
		 * @default false
		 */
		disabled?: boolean;
		/** Content before the text, such as an avatar or an icon. */
		prepend?: Snippet;
		/** Content after the row's link or button, such as a value or a menu button. */
		append?: Snippet;
		/** More content under the title and subtitle. */
		children?: Snippet;
	}
>;
