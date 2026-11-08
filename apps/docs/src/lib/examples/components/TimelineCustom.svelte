<script lang="ts">
	import { Amount, Timeline, type TimelineItem } from '@sveltier/ui';

	type Transfer = TimelineItem & { amount: number };
	let { transfers }: { transfers: Transfer[] } = $props();
</script>

<Timeline aria-label="Transfers" items={transfers} relative>
	{#snippet item(transfer)}
		<strong>{transfer.title}</strong>
		<Amount value={transfer.amount} format={{ style: 'currency' }} />
	{/snippet}
</Timeline>
