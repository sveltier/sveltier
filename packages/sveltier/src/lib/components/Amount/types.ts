import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/** The Amount props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AmountDefaults {
	/**
	 * Shows the decimal separator and the fraction digits in the subtle text colour, so the
	 * whole part reads first.
	 * @default false
	 */
	dimFraction: boolean;
	/**
	 * Shows "••••" in place of the figure, and "Amount hidden" to screen readers. Set it for a
	 * subtree through `DefaultsProvider` to hide every figure at once, for a shared screen.
	 * @default false
	 */
	masked: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Amount: AmountDefaults;
	}
}

/**
 * A figure: a number, a price, money or a percentage, formatted in the locale with tabular
 * figures and a true minus sign. A missing value shows a dash.
 *
 * Without fraction digits from `decimals` or `format`, a number keeps up to 8 decimals, a
 * percentage 2, and money its currency's digits.
 *
 * @example
 * <script>
 * 	import { Amount } from '@sveltier/ui';
 * </script>
 *
 * <Amount value={131.26} decimals={2} flash />
 * <Amount value={18084} format={{ style: 'currency' }} />
 * <Amount value={0.0125} format={{ style: 'percent' }} />
 * <Amount value={1.25} format={{ style: 'unit', unit: 'percent' }} />
 */
export type AmountProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	Partial<AmountDefaults> & {
		/** The figure. `null` or `undefined` shows a dash. */
		value: number | bigint | null | undefined;
		/**
		 * Intl.NumberFormat options. `style: 'currency'` is money in the locale's currency unless
		 * `currency` names another; `style: 'percent'` multiplies by 100 (0.0125 is 1.25%), while
		 * `style: 'unit', unit: 'percent'` takes a value that is already a percentage.
		 */
		format?: Intl.NumberFormatOptions;
		/** Exactly this many fraction digits, as a price shows them. Overrides `format`'s. */
		decimals?: number;
		/**
		 * When the value rises or falls, a wash of the up or down colour behind the figure fades
		 * out. Not on the first render, nor while masked.
		 * @default false
		 */
		flash?: boolean;
	}
>;
