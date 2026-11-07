import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density } from '../../core/props/types.js';

/** The Tree props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface TreeDefaults {
	/**
	 * Multiplies the height and padding of the rows, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * The colour of the selected row.
	 * @default 'primary'
	 */
	color: Color;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Tree: TreeDefaults;
	}
}

/** A node of the tree: a leaf, or a parent with `children`. */
export interface TreeItem {
	/** Identifies the node in `value` and `expanded`; unique across the tree. */
	value: string;
	/** What the row says; typing its first letters moves to it. */
	label: string;
	/**
	 * An icon before the label, drawn at the size and colour of the text: an SVG path on a
	 * 24×24 grid, as Material Design Icons export them (`mdiFolder`), or an icon component of any
	 * other set, such as `Folder` from phosphor-svelte. The component renders with no props.
	 */
	// Any props: a component's props are checked the other way round, so a narrower type would
	// turn away icon sets whose props take every SVG attribute.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: string | Component<any>;
	/** The nodes under it. A node with children, even none, opens and closes. */
	children?: readonly TreeItem[];
	/** Takes focus and opens, but cannot be selected. */
	disabled?: boolean;
}

/**
 * Nested nodes to browse and select one of, as the APG tree view pattern describes. Up and Down
 * move through the shown nodes, Right opens a parent or moves to its first child, Left closes it
 * or moves to the parent, Home and End jump to the ends, `*` opens the siblings, and typing moves
 * to the node that starts with it. Enter, Space or a click selects; focus moving does not. A
 * click on a parent's chevron opens or closes it. Name it with `aria-label` or
 * `aria-labelledby`. `class`, `style`, `ref` and other attributes go to the tree.
 *
 * @example
 * <Tree
 *   aria-label="Watchlists"
 *   items={[
 *     { value: 'crypto', label: 'Crypto', children: [{ value: 'btc', label: 'BTC/USDT' }] },
 *     { value: 'fx', label: 'FX', children: [{ value: 'eurusd', label: 'EUR/USD' }] }
 *   ]}
 *   bind:value={selected}
 *   bind:expanded={open}
 * />
 */
export type TreeProps<I extends TreeItem = TreeItem> = ElementProps<
	HTMLUListElement,
	Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'role'>,
	Partial<TreeDefaults> & {
		/** The top-level nodes, in order. */
		items: readonly I[];
		/**
		 * The selected node's value, or `null` for none. Bindable.
		 * @default null
		 */
		value?: string | null;
		/**
		 * The values of the open parents. Bindable.
		 * @default []
		 */
		expanded?: string[];
		/** Called with the node the user selects. */
		onselect?: (item: I) => void;
		/** The content of a row, in place of its icon and label. */
		item?: Snippet<[I]>;
	}
>;
