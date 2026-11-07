<script lang="ts">
	// A portfolio's value, moved by a button: the digits that change roll to the new value.
	import { Button, Odometer } from '@sveltier/ui';

	let value = $state(20594.4);

	function move() {
		const change = Math.round((Math.random() - 0.45) * 250000) / 100;
		value = Math.max(0, Math.round((value + change) * 100) / 100);
	}
</script>

<div class="docs-demo docs-odometer">
	<div class="docs-odometer__label">Portfolio value</div>
	<Odometer class="docs-odometer__figure" {value} format={{ style: 'currency' }} />
	<Button size="sm" variant="tonal" onclick={move}>Move the market</Button>
</div>

<style>
	.docs-odometer {
		display: grid;
		justify-items: start;
		gap: var(--sv-space-8);
	}

	.docs-odometer__label {
		color: var(--sv-color-text-muted);
		font-size: var(--sv-text-sm);
	}

	:global(.docs-odometer__figure) {
		font-size: var(--sv-text-headline);
		font-weight: var(--sv-weight-semibold);
		line-height: var(--sv-leading-tight);
	}
</style>
