import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';

/** The Ledger props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface LedgerDefaults {
	/**
	 * Multiplies the space between rows, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Ledger: LedgerDefaults;
	}
}

/**
 * Labels and their figures, one LedgerRow each, as a description list (`<dl>`). A Receipt holds
 * the same rows on a titled surface. `class`, `style`, `ref` and other attributes go to the
 * `<dl>`.
 *
 * @example
 * <script>
 * 	import { Ledger, LedgerRow } from '@sveltier/ui';
 * </script>
 *
 * <Ledger>
 * 	<LedgerRow label="Amount" value={1000} format={{ style: 'currency' }} />
 * 	<LedgerRow label="Fee" value={2.5} format={{ style: 'currency' }} />
 * 	<LedgerRow label="Total" value={1002.5} format={{ style: 'currency' }} total />
 * </Ledger>
 */
export type LedgerProps = ElementProps<
	HTMLDListElement,
	HTMLAttributes<HTMLDListElement>,
	Partial<LedgerDefaults> & {
		/** The rows: LedgerRows. */
		children?: Snippet;
	}
>;

/**
 * A label and its figure, joined by a dotted leader, as accounting paper writes them: a term and
 * its description (`<dt>` and `<dd>`). Put it in a Ledger or a Receipt. The figure is an Amount,
 * with the same `format` and `decimals`, and it follows Amount's `masked`.
 *
 * @example
 * <LedgerRow label="Fee" value={2.5} format={{ style: 'currency' }} />
 * <LedgerRow label="Arrives">Today</LedgerRow>
 * <LedgerRow label="Total" value={1002.5} format={{ style: 'currency' }} total />
 */
export type LedgerRowProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	{
		/** The label, before the leader. */
		label: string;
		/** The figure, shown by an Amount. `null` shows a dash. Ignored when there are children. */
		value?: number | bigint | null;
		/** Intl.NumberFormat options, as Amount takes them. */
		format?: Intl.NumberFormatOptions;
		/** Exactly this many fraction digits. Overrides `format`'s. */
		decimals?: number;
		/**
		 * The row that sums the ones above: a double rule over it, and the figure in a heavier
		 * weight, one size up.
		 * @default false
		 */
		total?: boolean;
		/** Content in place of the figure, such as "Today" or a Delta. */
		children?: Snippet;
	}
>;
