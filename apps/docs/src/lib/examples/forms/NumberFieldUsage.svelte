<script>
	import { NumberField } from '@sveltier/ui';
	let quantity = $state(1);
	let amount = $state(null);
</script>

<NumberField label="Quantity" name="quantity" min={1} max={99} step={1} bind:value={quantity} />

<!-- Digits only in format: the currency goes in prepend, so the text stays editable. -->
<NumberField
	label="Amount"
	name="amount"
	min={0}
	format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
	required
	bind:value={amount}
>
	{#snippet prepend()}USD{/snippet}
</NumberField>
