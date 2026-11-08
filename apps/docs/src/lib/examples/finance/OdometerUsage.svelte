<script lang="ts">
	import { Odometer } from '@sveltier/ui';

	let { balance }: { balance: number } = $props();
</script>

<Odometer value={balance} format={{ style: 'currency' }} />
