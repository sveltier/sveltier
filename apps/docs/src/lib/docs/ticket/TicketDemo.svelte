<script lang="ts">
	// An order ticket: a price by its tick, a quantity in lots out of what the cash buys, and the
	// order's cost. The ticks change with the price, as a stock exchange sets them.
	import { Amount, AmountInput, PriceInput, type StepBand } from '@sveltier/ui';

	const CASH = 125_000_000;
	const TICKS: StepBand[] = [
		{ from: 0, step: 10 },
		{ from: 10000, step: 50 },
		{ from: 50000, step: 100 }
	];

	let price = $state<number | null>(49950);
	let quantity = $state<number | null>(null);
	const available = $derived(price ? Math.floor(CASH / price) : undefined);
	const cost = $derived(price !== null && quantity !== null ? price * quantity : null);
</script>

<div class="docs-demo docs-ticket">
	<PriceInput label="Price" tick={TICKS} required bind:value={price} />
	<AmountInput
		label="Quantity"
		step={100}
		min={100}
		max={available}
		required
		bind:value={quantity}
	/>
	<p class="docs-dim">Cash <Amount value={CASH} />. Cost <Amount value={cost} />.</p>
</div>
