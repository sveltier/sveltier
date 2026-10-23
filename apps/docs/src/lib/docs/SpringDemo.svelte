<script lang="ts">
	// Three springs chase the same target, one per preset.
	import { spring, type SpringPreset } from 'sveltier';

	const PRESETS: SpringPreset[] = ['snappy', 'standard', 'gentle'];
	// Rebalancing swaps the golden split: 38.2% and 61.8%.
	const SPLIT = [38.2, 61.8] as const;

	const shares = PRESETS.map((preset) => ({ preset, share: spring<number>(SPLIT[0], preset) }));
	let side = 0;

	function rebalance() {
		side = 1 - side;
		for (const { share } of shares) share.target = SPLIT[side]!;
	}
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<button type="button" class="docs-button" onclick={rebalance}>Rebalance</button>
	</div>
	<ul class="docs-springs" aria-label="Equity share by spring preset">
		{#each shares as { preset, share } (preset)}
			<li class="docs-spring">
				<span class="docs-spring__name">{preset}</span>
				<span class="docs-spring__track" aria-hidden="true">
					<span class="docs-spring__fill" style:transform="scaleX({share.current / 100})"></span>
				</span>
				<span class="docs-num">{share.current.toFixed(1)}%</span>
			</li>
		{/each}
	</ul>
	<p class="docs-dim">
		Rebalance to move all three to the other side of the golden split. With reduced motion turned
		on, they jump there at once.
	</p>
</div>
