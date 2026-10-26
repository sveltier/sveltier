import type { NumberStep } from '../../core/form/number.js';
import type { NumberFieldProps } from '../NumberField/types.js';

/**
 * A price, typed in the locale and stepped by its tick: a fixed tick, or bands of ticks that
 * change with the price, as many stock markets set them. It shows as many decimals as the
 * smallest tick has, and a price off the ticks is an error. Everything else is a NumberField:
 * the same props, defaults and keys.
 *
 * @example
 * <script>
 * 	import { PriceInput } from '@sveltier/ui';
 * 	let price = $state(null);
 * </script>
 *
 * <PriceInput label="Limit price" tick={0.01} required bind:value={price} />
 *
 * <!-- A tick of 10 below 10,000, 50 up to 50,000, then 100. -->
 * <PriceInput
 * 	label="Price"
 * 	tick={[
 * 		{ from: 0, step: 10 },
 * 		{ from: 10000, step: 50 },
 * 		{ from: 50000, step: 100 }
 * 	]}
 * 	bind:value={price}
 * />
 */
export type PriceInputProps = Omit<NumberFieldProps, 'step'> & {
	/**
	 * The tick size: a fixed one such as `0.01`, or bands such as
	 * `[{ from: 0, step: 10 }, { from: 10000, step: 50 }]`. The keys and buttons move by the tick
	 * at the price, and `min` defaults to the smallest tick, so a price is never zero.
	 */
	tick: NumberStep;
};
