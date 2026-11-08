import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Breakpoint } from '../../core/display/display.js';
import type { CloseReason } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';

/**
 * The frame of an app: an `AppBar`, a `NavigationDrawer`, the `Main` content and an `AppFooter` on
 * a CSS grid.
 * Each part takes its own area, so the content never sits under the bar or the drawer, with
 * nothing measured and the right layout from the server; a part left out leaves no gap. The part
 * written first takes the corner: the bar first runs across the top, with the drawer below it;
 * the drawer first runs the full height, with the bar beside it. The layout starts with a "Skip
 * to content" link that shows on focus. The bar's height is in `--sv-app-bar-height`, for content
 * that places itself under a sticky bar. `class`, `style`, `ref` and other attributes go to the
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
		/**
		 * Fills the window and never scrolls the page, for an app whose panes scroll on their own
		 * (a trading terminal, a mail client). Main takes the height the bar leaves and scrolls on
		 * its own when its content is taller; content with `block-size: 100%` fills it. A
		 * breakpoint fills only from its default width up (`md` is 960px): below it the page
		 * scrolls, so a phone's browser bars collapse as the page moves. Without it, the layout
		 * is at least the window's height and the page scrolls.
		 * @default false
		 */
		fill?: boolean | Breakpoint;
		/** The parts: `AppBar`, `NavigationDrawer`, `Main` and `AppFooter`. */
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
 * The bar across the top of an app, one line a control and a half tall: the app's mark, a title,
 * links, any content, and actions at the end. In an `AppLayout` with a `NavigationDrawer`, it starts with a
 * menu button that opens the drawer while the screen is too narrow to keep it beside the content,
 * and its `nav` links show only while that button does not. It is the page's banner landmark.
 * `class`, `style`, `ref` and other attributes go to the `<header>`.
 *
 * @example
 * <AppBar title="Ledger">
 *   {#snippet prepend()}<a href="/"><Logo /></a>{/snippet}
 *   {#snippet nav()}
 *     <List nav>
 *       <ListItem title="Payments" href="/payments" active />
 *       <ListItem title="Cards" href="/cards" />
 *     </List>
 *   {/snippet}
 *   {#snippet actions()}
 *     <Button variant="text" color="neutral">Sign out</Button>
 *   {/snippet}
 * </AppBar>
 */
export type AppBarProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	Partial<AppBarDefaults> & {
		/**
		 * The app's mark at the start, after the menu button and before the title: usually a link
		 * home with the logo and the name. It shows at every width.
		 */
		prepend?: Snippet;
		/** The name of the app or of the current section, at the start. */
		title?: string;
		/**
		 * The app's navigation across the bar, after the title, in a navigation landmark named
		 * "Main" (the locale's `mainNavigation`). A `List` with `nav` in it lays out in a row, its
		 * `ListItem active` marked as the current page, as it is in the drawer. In an `AppLayout` with a `NavigationDrawer`, it
		 * shows only from the drawer's breakpoint up; below it, the menu button opens the drawer
		 * instead. With a `modal` drawer, the links move between the bar and the drawer.
		 */
		nav?: Snippet;
		/** Content after the title and the links, such as a search field. It takes the free space. */
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
		 * Only the modal drawer: below the breakpoint it opens from the app bar's menu button, and
		 * from the breakpoint up there is no drawer, for an app whose bar carries the navigation
		 * on a wide screen (the bar's `nav`). The page keeps its frame at every width.
		 * @default false
		 */
		modal?: boolean;
		/**
		 * The narrowest screen on which the drawer stays beside the content (or, `modal`, is left
		 * out), at the breakpoint's default width (`md` is 960px); below it, the drawer is modal.
		 * `xs` keeps it beside the content at any width.
		 * @default 'md'
		 */
		breakpoint?: Breakpoint;
		/**
		 * Called when the modal drawer closes itself, with the reason: `'escape'`, `'outside'` (a
		 * press beside it) or `'action'` (a link in it followed). Not when the screen grows past
		 * the breakpoint, nor when `open` is set.
		 */
		onclose?: (reason: CloseReason) => void;
		/** The navigation, usually a `List` with `nav`. */
		children?: Snippet;
	}
>;

/** The AppFooter props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AppFooterDefaults {
	/**
	 * Multiplies the height and padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Stays at the bottom of the window while the page scrolls.
	 * @default false
	 */
	sticky: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		AppFooter: AppFooterDefaults;
	}
}

/**
 * The status bar along the bottom of an app, one line a control tall, such as a market clock or
 * the state of a connection. In an `AppLayout` it sits under the content, as wide as the bar: the
 * full width with the bar written first, beside the drawer with the drawer written first. It is
 * the page's contentinfo landmark. A multi-line site footer belongs at the end of `Main` instead.
 * `class`, `style`, `ref` and other attributes go to the `<footer>`.
 *
 * @example
 * <AppFooter>
 *   <span>Market open</span>
 *   <span>Connected</span>
 * </AppFooter>
 */
export type AppFooterProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	Partial<AppFooterDefaults> & {
		/** The content of the line. */
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
