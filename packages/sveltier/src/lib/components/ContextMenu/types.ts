import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { CloseReason } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';
import type { MenuAction, MenuItem } from '../Menu/types.js';

/** The ContextMenu props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ContextMenuDefaults {
	/**
	 * Multiplies the height and padding of the items, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		ContextMenu: ContextMenuDefaults;
	}
}

/**
 * What a ContextMenu passes to its `target` snippet: the handlers that open it with a right
 * click (or a long press, where the browser makes one a `contextmenu` event), Shift+F10 or the
 * ContextMenu key. Spread it onto the element, or onto every row of a list.
 */
export interface ContextMenuTargetAttributes {
	oncontextmenu: (event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) => void;
	onkeydown: (event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) => void;
}

/**
 * A menu of actions on an element, opened where the user right-clicks it, or below it with
 * Shift+F10 or the ContextMenu key while it has focus. The menu is a Menu's: arrow keys move
 * through the items and wrap, typing moves to an item, Enter and Space choose, Escape closes and
 * gives focus back, Tab closes and moves on. One ContextMenu can serve many elements: `onopen`
 * says which one it opened on. The keys open it only on an element that takes focus, so give
 * keyboard users the same actions another way too, such as a Menu on the row. `class`, `style`,
 * `ref` and other attributes go to the menu.
 *
 * @example
 * <ContextMenu
 *   label="Order actions"
 *   items={[
 *     { label: 'Copy id', value: 'copy' },
 *     { separator: true },
 *     { label: 'Cancel order', value: 'cancel', danger: true }
 *   ]}
 *   onopen={(row) => (order = row.dataset.id ?? null)}
 *   onselect={(item) => run(item.value, order)}
 * >
 *   {#snippet target(attributes)}
 *     {#each orders as o (o.id)}
 *       <tr {...attributes} data-id={o.id}>…</tr>
 *     {/each}
 *   {/snippet}
 * </ContextMenu>
 */
export type ContextMenuProps = ElementProps<
	HTMLDivElement,
	Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'popover' | 'role'>,
	Partial<ContextMenuDefaults> & {
		/** Names the menu, as it has no button to name it: `Order actions`. */
		label: string;
		/** The entries, in order. */
		items: readonly MenuItem[];
		/** Called with the item the user chooses, after the menu has closed. */
		onselect?: (item: MenuAction) => void;
		/** The element or elements it opens on. Spread the attributes it receives onto each. */
		target: Snippet<[ContextMenuTargetAttributes]>;
		/**
		 * Called with the element it opens on, before it shows, so the items can follow it.
		 */
		onopen?: (target: HTMLElement) => void;
		/**
		 * Whether it is open. Bindable: set it to `false` to close it; it opens from its target,
		 * and sets this to `false` when it closes itself.
		 * @default false
		 */
		open?: boolean;
		/** Called when it closes itself, with the reason; `'action'` after a choice. */
		onclose?: (reason: CloseReason) => void;
	}
>;
