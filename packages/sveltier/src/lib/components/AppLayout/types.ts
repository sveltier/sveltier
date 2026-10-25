import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Breakpoint } from '../../core/display/display.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';

/**
 * The frame of an app: an `AppBar`, a `NavigationDrawer` and the `Main` content on a CSS grid.
 * Each part takes its own area, so the content never sits under the bar or the drawer, with
 * nothing measured and the right layout from the server; a part left out leaves no gap. The part
 * written first takes the corner: the bar first runs across the top, with the drawer below it;
 * the drawer first runs the full height, with the bar beside it. The layout starts with a "Skip
 * to content" link that shows on focus. `class`, `style`, `ref` and other attributes go to the
 * root `<div>`.
 *
 * @example
 * <AppLayout>
 *   <AppBar title="Ledger" />
 *   <NavigationDrawer>
 *     <List nav>
 *       <ListItem title="Payments" href="/payments" active />
 *     </List>
 *   </NavigationDrawer>
 *   <Main>{@render children()}</Main>
 * </AppLayout>
 */
export type AppLayoutProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	{
		/** The parts: `AppBar`, `NavigationDrawer` and `Main`. */
		children?: Snippet;
	}
>;

/** The AppBar props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AppBarDefaults {
	/**
	 * Multiplies the height and padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Stays at the top of the window while the page scrolls.
	 * @default true
	 */
	sticky: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		AppBar: AppBarDefaults;
	}
}

/**
 * The bar across the top of an app, one line a control and a half tall: a title, any content,
 * and actions at the end. In an `AppLayout` with a `NavigationDrawer`, it starts with a menu
 * button that opens the drawer while the screen is too narrow to keep it beside the content. It
 * is the page's banner landmark. `class`, `style`, `ref` and other attributes go to the
 * `<header>`.
 *
 * @example
 * <AppBar title="Ledger">
 *   {#snippet actions()}
 *     <Button variant="text" color="neutral">Sign out</Button>
 *   {/snippet}
 * </AppBar>
 */
export type AppBarProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	Partial<AppBarDefaults> & {
		/** The name of the app or of the current section, at the start. */
		title?: string;
		/** Content after the title, such as links or a search field. It takes the free space. */
		children?: Snippet;
		/** Buttons at the end. */
		actions?: Snippet;
	}
>;

/**
 * The app's navigation, at the start of an `AppLayout`. From its `breakpoint` up, it stays beside
 * the content, the height of the window, and `rail` narrows it to its icons. Below the
 * breakpoint, it is a modal drawer that slides in from the start: the app bar's menu button or
 * `bind:open` opens it, and Escape, a press outside it or a link inside it closes it. It is a
 * navigation landmark named "Main" (the locale's `mainNavigation`); `aria-label` names it
 * otherwise. `class`, `style`, `ref` and other attributes go to the `<nav>`; `class` goes to the
 * modal drawer too.
 *
 * @example
 * <NavigationDrawer>
 *   <List nav>
 *     <ListItem title="Payments" href="/payments" active>
 *       {#snippet prepend()}<Icon path={PAYMENTS} />{/snippet}
 *     </ListItem>
 *   </List>
 * </NavigationDrawer>
 */
export type NavigationDrawerProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	{
		/**
		 * Whether the modal drawer is open, below the breakpoint. Bindable; it turns `false` when
		 * the drawer closes itself, and when the screen grows past the breakpoint.
		 * @default false
		 */
		open?: boolean;
		/**
		 * Narrows the drawer to its icons, from the breakpoint up. A `List` inside keeps the icons
		 * of its items and hides their text from sight, not from assistive technology.
		 * @default false
		 */
		rail?: boolean;
		/**
		 * The narrowest screen on which the drawer stays beside the content, at the breakpoint's
		 * default width (`md` is 960px); below it, the drawer is modal. `xs` keeps it beside the
		 * content at any width.
		 * @default 'md'
		 */
		breakpoint?: Breakpoint;
		/** The navigation, usually a `List` with `nav`. */
		children?: Snippet;
	}
>;

/**
 * The main content of an `AppLayout`, in the space the bar and the drawer leave. It is the page's
 * `<main>` landmark, where the layout's skip link goes: its `id` is the one the layout made for
 * that link, so it takes no `id` of its own. `class`, `style`, `ref` and other attributes go to
 * the `<main>`.
 *
 * @example
 * <Main>
 *   <h1>Payments</h1>
 * </Main>
 */
export type MainProps = ElementProps<
	HTMLElement,
	Omit<HTMLAttributes<HTMLElement>, 'id'>,
	{
		/** The content of the page. */
		children?: Snippet;
	}
>;
