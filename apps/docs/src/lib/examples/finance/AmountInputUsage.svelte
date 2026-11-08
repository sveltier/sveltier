<script lang="ts">
	import { AmountInput } from '@sveltier/ui';

	let { available }: { available: number } = $props();
	let quantity = $state<number | null>(null);
</script>

<!-- Lots of 100 out of what is available: 50% of 2,350 sets 1,100. -->
<AmountInput label="Quantity" step={100} min={100} max={available} required bind:value={quantity} />
