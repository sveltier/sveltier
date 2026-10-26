import type { NumberFieldProps } from '../NumberField/types.js';

/**
 * An amount to use out of what is available, such as a quantity to sell or a sum to invest: a
 * NumberField with buttons under it for shares of `max`. A share is rounded down to whole
 * steps, so it never asks for more than there is. Everything else is a NumberField: the same
 * props, defaults and keys.
 *
 * @example
 * <script>
 * 	import { AmountInput } from '@sveltier/ui';
 * 	let quantity = $state(null);
 * </script>
 *
 * <!-- Lots of 100, out of 2,350 available: 50% sets 1,100. -->
 * <AmountInput label="Quantity" step={100} min={100} max={2350} bind:value={quantity} />
 */
export type AmountInputProps = NumberFieldProps & {
	/**
	 * The shares of `max` offered as buttons, as fractions: `0.25` is "25%". Without `max`,
	 * there are no buttons.
	 * @default [0.25, 0.5, 0.75, 1]
	 */
	shares?: readonly number[];
};
