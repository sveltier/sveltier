import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';

/** The Receipt props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ReceiptDefaults {
	/**
	 * Multiplies the padding and the space between rows, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Receipt: ReceiptDefaults;
	}
}

/**
 * The record of a payment, a transfer or an order: a titled surface holding LedgerRows, the total
 * under a double rule, and a footer. The rows are a description list (`<dl>`); the receipt is a
 * `<section>` named by its title. `class`, `style`, `ref` and other attributes go to the
 * `<section>`.
 *
 * @example
 * <script>
 * 	import { LedgerRow, Receipt } from '@sveltier/ui';
 * </script>
 *
 * <Receipt title="Transfer sent" subtitle="Ref. TX-20261107-0042" level={2}>
 * 	<LedgerRow label="Amount" value={1000} format={{ style: 'currency' }} />
 * 	<LedgerRow label="Fee" value={2.5} format={{ style: 'currency' }} />
 * 	<LedgerRow label="Total" value={1002.5} format={{ style: 'currency' }} total />
 * </Receipt>
 */
export type ReceiptProps = ElementProps<
	HTMLElement,
	HTMLAttributes<HTMLElement>,
	Partial<ReceiptDefaults> & {
		/** What the receipt is for, such as "Transfer sent". It names the section. */
		title: string;
		/** A line under the title, such as a reference or a date. */
		subtitle?: string;
		/**
		 * Makes the title a heading of this level (`<h2>`, `<h3>`…), so it is in the page's
		 * outline. Without it the title is styled text.
		 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** The rows: LedgerRows. */
		children?: Snippet;
		/** Under the rows, such as a note or an action. */
		footer?: Snippet;
	}
>;
