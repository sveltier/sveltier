import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/** One step of the trail. */
export interface BreadcrumbsItem {
	/** What the step says. */
	label: string;
	/** Where it leads. Without it, the step is text. */
	href?: string;
}

/**
 * Where the current page sits: the pages above it as links, and the page itself last, marked
 * as the current page. It is a navigation landmark named "Breadcrumb" (the locale's
 * `breadcrumb`); `aria-label` names it otherwise. `class`, `style`, `ref` and other attributes
 * go to the `<nav>`.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Accounts', href: '/accounts' }, { label: 'Savings' }]} />
 */
export type BreadcrumbsProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	{
		/** The steps from the top, the current page last. */
		items: readonly BreadcrumbsItem[];
	}
>;
