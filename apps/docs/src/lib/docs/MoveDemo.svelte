<script lang="ts">
	// A watchlist ranked by change. Each tick moves the changes on a fixed walk, so the page renders
	// the same every time, and a row that changes rank slides to its new place.
	import { Delta, move } from '@sveltier/ui';

	const START = [
		{ symbol: 'VNM', change: 0.012 },
		{ symbol: 'FPT', change: 0.031 },
		{ symbol: 'HPG', change: -0.008 },
		{ symbol: 'ACB', change: 0.004 },
		{ symbol: 'MWG', change: -0.021 }
	];

	let quotes = $state(START);
	let step = 0;
	const ranked = $derived([...quotes].sort((a, b) => b.change - a.change));

	function tick() {
		step += 1;
		quotes = quotes.map((quote, i) => ({
			...quote,
			change: Math.round((quote.change + Math.sin(step * 2.1 + i * 1.7) * 0.021) * 10000) / 10000
		}));
	}
</script>

<div class="docs-demo">
	<div class="docs-demo__controls">
		<button type="button" class="docs-button" onclick={tick}>Next tick</button>
	</div>
	<ol class="docs-watchlist" aria-label="Watchlist, biggest movers first">
		{#each ranked as quote (quote.symbol)}
			<li animate:move>
				<span>{quote.symbol}</span>
				<Delta value={quote.change} format={{ style: 'percent' }} decimals={2} />
			</li>
		{/each}
	</ol>
	<p class="docs-dim">
		Each tick moves the changes; a row that changes rank slides to its new place. A Table sorted by
		a column does the same.
	</p>
</div>
