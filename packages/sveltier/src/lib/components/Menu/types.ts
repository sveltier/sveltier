import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';
import type { Align, Side } from '../../primitives/anchored/anchored.js';

/** The Menu props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface MenuDefaults {
	/**
	 * Multiplies the height and padding of the items, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Menu: MenuDefaults;
	}
}

/** An item the user can choose. */
export interface MenuAction {
	/** What the item says; typing its first letters moves to it. */
	label: string;
	/** An identifier for `onselect` to tell the items apart. */
	value?: string;
	/**
	 * An icon before the label: an SVG path on a 24×24 grid, as icon sets such as Material Design
	 * Icons export them (`mdiPencil`).
	 */
	icon?: string;
	/** A keyboard shortcut shown at the end, such as `Ctrl+C`. Showing it does not bind it. */
	shortcut?: string;
	/** Shown but not chosen, and skipped by the arrow keys. */
	disabled?: boolean;
	/** In the error colour, for an action that deletes or cannot be undone. */
	danger?: boolean;
}

/** A line between groups of items. */
export interface MenuSeparator {
	separator: true;
}

/** A heading that names the items after it, up to the next heading or separator. */
export interface MenuHeading {
	heading: string;
}

/** An entry of `items`: an action, a separator or a heading. */
export type MenuItem = MenuAction | MenuSeparator | MenuHeading;

/**
 * A list of actions that opens from a control, as the APG menu button pattern describes. Arrow
 * keys move through the items and wrap, Home and End jump to the ends, typing moves to the item
 * that starts with it, Enter and Space choose, Escape closes and gives focus back, and Tab closes
 * and moves on. `class`, `style`, `ref` and other attributes go to the menu.
 *
 * @example
 * <Menu
 *   items={[
 *     { label: 'Rename', value: 'rename', shortcut: 'F2' },
 *     { separator: true },
 *     { label: 'Delete', value: 'delete', danger: true }
 *   ]}
 *   onselect={(item) => run(item.value)}
 * >
 *   {#snippet trigger(attributes)}<Button {...attributes}>Actions</Button>{/snippet}
 * </Menu>
 */
export type MenuProps = ElementProps<
	HTMLDivElement,
	Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'popover' | 'role'>,
	Partial<MenuDefaults> & {
		/** The entries, in order. */
		items: readonly MenuItem[];
		/** Called with the item the user chooses, after the menu has closed. */
		onselect?: (item: MenuAction) => void;
		/** The control that opens it. Spread the attributes it receives onto it. */
		trigger: Snippet<[TriggerAttributes]>;
		/**
		 * Whether it is open. Bindable; it sets this to `false` when it closes itself.
		 * @default false
		 */
		open?: boolean;
		/**
		 * The side of the control it opens on, moved to the opposite side when there is no room.
		 * @default 'bottom'
		 */
		side?: Side;
		/**
		 * Its alignment along that side.
		 * @default 'start'
		 */
		align?: Align;
		/** Called when it closes itself, with the reason; `'action'` after a choice. */
		onclose?: (reason: CloseReason) => void;
	}
>;
