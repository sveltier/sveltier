import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { AmountDefaults } from '../Amount/types.js';

/**
 * A headline figure whose digits roll to the new value when it changes, as an odometer's do. It
 * is formatted as an Amount is, with the same `format` and `decimals`, and it follows Amount's
 * `masked` and `font`. Under reduced motion the digits change at once. For a figure inside a sentence, use
 * an Amount.
 *
 * @example
 * <script>
 * 	import { Odometer } from '@sveltier/ui';
 * 	let { total }: { total: number } = $props();
 * </script>
 *
 * <Odometer value={total} format={{ style: 'currency' }} />
 */
export type OdometerProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	{
		/** The figure. `null` or `undefined` shows a dash. */
		value: number | bigint | null | undefined;
		/** Intl.NumberFormat options, as Amount takes them. */
		format?: Intl.NumberFormatOptions;
		/** Exactly this many fraction digits. Overrides `format`'s. */
		decimals?: number;
		/** Hides the figure. Without it, the figure follows Amount's `masked` default. */
		masked?: boolean;
		/**
		 * The face of the figure: `'data'`, the theme's data face, or `'inherit'`, the font of
		 * the text around it. Without it, the figure follows Amount's `font` default.
		 */
		font?: AmountDefaults['font'];
	}
>;
