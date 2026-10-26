<script lang="ts">
	// A quote that moves while Live is on, flashing up and down, and a balance with a dimmed
	// fraction. The privacy switch masks every figure inside, the change among them.
	import { Amount, DefaultsProvider, Delta, Switch } from '@sveltier/ui';

	const OPEN = 131.26;
	let price = $state(OPEN);
	let live = $state(false);
	let hidden = $state(false);

	// A random walk of a few cents, a little more often up than down.
	$effect(() => {
		if (!live) return;
		const timer = setInterval(() => {
			const step = (Math.random() - 0.46) * 0.9;
			price = Math.max(1, Math.round((price + step) * 100) / 100);
		}, 1200);
		return () => clearInterval(timer);
	});
</script>

<div class="docs-demo">
	<div class="docs-table-controls">
		<Switch label="Live" bind:checked={live} />
		<Switch label="Hide amounts" bind:checked={hidden} />
	</div>
	<DefaultsProvider defaults={{ Amount: { masked: hidden } }}>
		<div class="docs-quote">
			<span class="docs-quote__symbol">NVDA</span>
			<Amount class="docs-quote__price" value={price} decimals={2} flash />
			<Delta value={(price - OPEN) / OPEN} format={{ style: 'percent' }} arrow flash />
		</div>
		<p class="docs-dim">
			Balance <Amount value={15751.2} format={{ style: 'currency' }} dimFraction />
		</p>
	</DefaultsProvider>
</div>
