<script lang="ts">
	// An order ticket in a themed scope: a price with a tick and a quantity in lots out of what is
	// available, each with its bound value shown. The test picks the props of each.
	import AmountInput from '../../lib/components/AmountInput/AmountInput.svelte';
	import type { AmountInputProps } from '../../lib/components/AmountInput/types.js';
	import PriceInput from '../../lib/components/PriceInput/PriceInput.svelte';
	import type { PriceInputProps } from '../../lib/components/PriceInput/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		price = $bindable(null),
		quantity = $bindable(null),
		priceProps = {},
		quantityProps = {}
	}: {
		price?: number | null;
		quantity?: number | null;
		priceProps?: Partial<PriceInputProps>;
		quantityProps?: Partial<AmountInputProps>;
	} = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<PriceInput label="Price" tick={0.05} {...priceProps} bind:value={price} />
	<AmountInput
		label="Quantity"
		step={100}
		min={100}
		max={2350}
		{...quantityProps}
		bind:value={quantity}
	/>
	<input aria-label="Next" />
	<span data-testid="price">{price === null ? 'null' : price}</span>
	<span data-testid="quantity">{quantity === null ? 'null' : quantity}</span>
</ThemeProvider>
