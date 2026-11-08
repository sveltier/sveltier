<script lang="ts">
	import { Delta } from '@sveltier/ui';

	let { pnl, change }: { pnl: number; change: number } = $props();
</script>

<!-- +4,183.20 in the up colour, −639.00 in the down colour: the sign is always there. -->
<Delta value={pnl} decimals={2} />

<!-- A change in percent, with an arrow, flashing as it moves. -->
<Delta value={change} format={{ style: 'percent' }} arrow flash />
