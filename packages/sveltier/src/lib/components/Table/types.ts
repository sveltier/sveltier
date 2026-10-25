import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';

/** How a column lines up its header and its cells. */
export const TABLE_ALIGNS = ['start', 'center', 'end'] as const;
export type TableAlign = (typeof TABLE_ALIGNS)[number];

/** The ways a table can be sorted, named as `aria-sort` names them. */
export const SORT_DIRECTIONS = ['ascending', 'descending'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

/** The column a table is sorted by, and which way. */
export interface TableSort {
	/** The `key` or `id` of the column. */
	column: string;
	direction: SortDirection;
}

/** The Table props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface TableDefaults {
	/**
	 * The colour of the current row and of the sort arrow.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Row height and text size.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the row height and the cell padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Tints the row under the pointer.
	 * @default false
	 */
	hover: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Table: TableDefaults;
	}
}

/** What every column takes, whatever it shows. */
export interface TableColumnBase<T> {
	/** The header's text, which also names the column's sort button. */
	label: string;
	/** Hides the header's text from sight, for a column of buttons; screen readers still read it. */
	hideLabel?: boolean;
	/**
	 * Lines up the header and the cells. Numbers line up at the end unless this says otherwise,
	 * read from the column's first value; a table that starts empty has none to read, so give its
	 * number columns `'end'`.
	 */
	align?: TableAlign;
	/** A CSS width for the column, such as `'8rem'` or `'20%'`. */
	width?: string;
	/** Lets long text wrap; cells keep to one line otherwise. */
	wrap?: boolean;
	/**
	 * Makes the column's cells the headers of their rows (`<th scope="row">`), for the value that
	 * names a row, such as a symbol or a name.
	 */
	rowHeader?: boolean;
	/**
	 * Lets the header sort the table. `true` compares the column's values: numbers, dates and
	 * text in the locale's order, empty values last. A function compares two items itself.
	 */
	sort?: boolean | ((a: T, b: T) => number);
	/** The cell's content, in place of its text. Receives the row's item. */
	cell?: Snippet<[item: T]>;
}

/** A column that shows a property of the items, named by `key`. */
export type TableKeyColumn<T> = {
	[K in keyof T & string]: TableColumnBase<T> & {
		/** The property the column shows. It also names the column in `sortBy`. */
		key: K;
		id?: never;
		value?: never;
		/** The cell's text for a value that is there; a missing value shows a dash. */
		format?: (value: NonNullable<T[K]>, item: T) => string;
	};
}[keyof T & string];

/**
 * A column named by `id`: it shows a value computed from each item (`value`), or content of its
 * own (`cell`), such as a button.
 */
export type TableValueColumn<T> = TableColumnBase<T> & {
	/** Names the column, in `sortBy` too. */
	id: string;
	key?: never;
} & (
		| {
				/** Computes the value of the item's cell; the column sorts by it too. */
				value: (item: T) => unknown;
				/**
				 * The cell's text for a value that is there; a missing value shows a dash. Receives
				 * what `value` returned.
				 */
				// The value's type differs from one column to the next, and an array of columns
				// cannot carry it, so it is left open here.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				format?: (value: any, item: T) => string;
		  }
		| { value?: never; format?: never; cell: Snippet<[item: T]> }
	);

/**
 * One column of a Table: a property of the items, named by `key`; or, named by `id`, a value
 * computed from each item or content of its own.
 */
export type TableColumn<T> = TableKeyColumn<T> | TableValueColumn<T>;

/**
 * A table of items, one row each, in the columns you describe. Headers stay in view while it
 * scrolls, numbers line up at the end, and a column with `sort` sorts by its header. Name it
 * with `caption`, `aria-label` or `aria-labelledby`, which go to the `<table>`.
 *
 * @example
 * <script lang="ts">
 * 	import { Table, type TableColumn } from '@sveltier/ui';
 * 	type Position = { symbol: string; quantity: number; price: number };
 * 	let { positions }: { positions: Position[] } = $props();
 * 	const columns: TableColumn<Position>[] = [
 * 		{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
 * 		{ key: 'quantity', label: 'Quantity', sort: true },
 * 		{ key: 'price', label: 'Price', format: (price) => price.toFixed(2) },
 * 		{ id: 'value', label: 'Value', value: (p) => p.quantity * p.price, sort: true }
 * 	];
 * </script>
 *
 * <Table caption="Positions" {columns} items={positions} itemKey="symbol" />
 */
export type TableProps<T> = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<TableDefaults> & {
		/** The rows, in order. */
		items: readonly T[];
		/** The columns, in order. */
		columns: readonly TableColumn<T>[];
		/**
		 * The property that tells items apart, so a row keeps its element when the items are
		 * replaced by fresh copies, as live data is. Without it, rows follow the items themselves.
		 */
		itemKey?: keyof T;
		/**
		 * The column the rows are sorted by, and which way. Bindable. Clicking a header sorts
		 * ascending, then descending, then back to the order of `items`.
		 */
		sortBy?: TableSort;
		/** Called when a header changes the sort, with the new sort or `undefined`. */
		onsort?: (sortBy: TableSort | undefined) => void;
		/** A visible title for the table, which also names it. */
		caption?: string;
		/**
		 * Shows that rows are on their way: a bar along the top, `aria-busy` on the table, and
		 * "Loading" in place of the empty state.
		 * @default false
		 */
		loading?: boolean;
		/** What the table shows when there are no items, in place of "No data". */
		empty?: Snippet;
		/**
		 * Attributes for an item's row: a class, data attributes, or `aria-current` for the row
		 * whose details show elsewhere, which the table marks in its colour.
		 */
		rowAttributes?: (item: T) => HTMLAttributes<HTMLTableRowElement>;
	}
>;
