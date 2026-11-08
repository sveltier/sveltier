<script lang="ts">
	import { Amount } from '@sveltier/ui';

	let { last, balance }: { last: number; balance: number } = $props();
</script>

<!-- A live price: two decimals, a flash of the up or down colour as it moves. -->
<Amount value={last} decimals={2} flash />

<!-- Money in the locale's currency, its fraction in the subtle colour. -->
<Amount value={balance} format={{ style: 'currency' }} dimFraction />
