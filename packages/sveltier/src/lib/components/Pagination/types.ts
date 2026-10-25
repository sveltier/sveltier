import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';

/** The Pagination props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface PaginationDefaults {
	/**
	 * The colour of the current page.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Height and text size of the controls. `sm` keeps nine controls on one line of a phone.
	 * @default 'sm'
	 */
	size: Size;
	/**
	 * Multiplies the height and padding of the controls, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Page numbers shown on each side of the current page.
	 * @default 1
	 */
	siblings: number;
	/**
	 * Page numbers always shown at the start and at the end.
	 * @default 1
	 */
	boundaries: number;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Pagination: PaginationDefaults;
	}
}

/**
 * The pages of a long list, between the previous and the next page. With `href`, every page is
 * a link, for pages that load by URL; otherwise they are buttons, and `bind:page` follows the
 * one chosen. Gaps stand for the numbers left out, keeping the controls in place. It is a
 * navigation landmark named "Pagination" (the locale's `pagination`); `aria-label` names it
 * otherwise. `class`, `style`, `ref` and other attributes go to the `<nav>`.
 *
 * @example
 * <Pagination count={12} bind:page />
 * <Pagination count={data.pages} page={data.page} href={(page) => `?page=${page}`} />
 */
export type PaginationProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	Partial<PaginationDefaults> & {
		/** How many pages there are. */
		count: number;
		/**
		 * The current page, from 1. Bindable.
		 * @default 1
		 */
		page?: number;
		/** The address of a page. With it, the pages are links. */
		href?: (page: number) => string;
		/** Called with the page the user picks. */
		onchange?: (page: number) => void;
	}
>;
