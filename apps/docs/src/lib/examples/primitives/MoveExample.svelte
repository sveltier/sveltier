<script lang="ts">
	import { Delta, move } from '@sveltier/ui';

	let { quotes }: { quotes: { symbol: string; change: number }[] } = $props();

	// Biggest movers first: a row that changes rank slides to its new place.
	const ranked = $derived([...quotes].sort((a, b) => b.change - a.change));
</script>

<ol aria-label="Watchlist">
	{#each ranked as quote (quote.symbol)}
		<li animate:move>
			{quote.symbol}
			<Delta value={quote.change} format={{ style: 'percent' }} decimals={2} />
		</li>
	{/each}
</ol>
