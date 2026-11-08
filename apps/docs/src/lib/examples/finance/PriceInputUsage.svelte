<script lang="ts">
	import { PriceInput } from '@sveltier/ui';

	let limit = $state<number | null>(null);
	let price = $state<number | null>(null);
</script>

<!-- A fixed tick: two decimals, the arrow keys move by 0.01, 61.234 is an error. -->
<PriceInput label="Limit price" tick={0.01} required bind:value={limit} />

<!-- Ticks that change with the price: 10 below 10,000, 50 up to 50,000, then 100. -->
<PriceInput
	label="Price"
	tick={[
		{ from: 0, step: 10 },
		{ from: 10000, step: 50 },
		{ from: 50000, step: 100 }
	]}
	bind:value={price}
/>
