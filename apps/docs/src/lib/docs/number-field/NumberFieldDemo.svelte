<script lang="ts">
	// A quantity stepped by one between limits, and an amount written with two decimals.
	import { NumberField } from 'sveltier';

	let quantity = $state<number | null>(1);
	let amount = $state<number | null>(null);
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<NumberField
			label="Quantity"
			name="quantity"
			hint="From 1 to 99"
			min={1}
			max={99}
			step={1}
			bind:value={quantity}
		/>
		<NumberField
			label="Amount"
			name="amount"
			hint="Try 1234.5, then leave the field"
			min={0}
			format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
			required
			bind:value={amount}
		>
			{#snippet prepend()}<span>USD</span>{/snippet}
		</NumberField>
	</div>
	<p class="docs-dim">
		Bound values: <code>quantity = {JSON.stringify(quantity)}</code>,
		<code>amount = {JSON.stringify(amount)}</code>
	</p>
</div>
