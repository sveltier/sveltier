<script>
	import { virtualList } from '@sveltier/ui';
	let { transactions } = $props();

	// Read through a function, so the list follows transactions.length.
	const list = virtualList(() => ({ count: transactions.length, itemSize: 34 }));
</script>

<div class="viewport" {@attach list.viewport}>
	<div style:height="{list.totalSize}px" style:position="relative">
		{#each list.items as item (item.key)}
			<div class="row" style:transform="translateY({item.start}px)">
				{transactions[item.index].label}
			</div>
		{/each}
	</div>
</div>

<style>
	.viewport {
		height: 377px;
		overflow-y: auto;
	}
	.row {
		position: absolute;
		inset-inline: 0;
		height: 34px;
	}
</style>
