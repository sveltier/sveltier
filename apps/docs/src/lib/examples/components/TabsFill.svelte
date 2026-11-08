<script lang="ts">
	import { Table, Tabs, TextField, type TableColumn } from '@sveltier/ui';

	type Market = { symbol: string; kind: 'spot' | 'futures'; last: number; change: number };
	let { markets }: { markets: Market[] } = $props();

	const views = [
		{ value: 'spot', label: 'Spot' },
		{ value: 'futures', label: 'Futures' }
	];
	const columns: TableColumn<Market>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'last', label: 'Last' },
		{ key: 'change', label: 'Change' }
	];
	let view = $state('spot');
	let query = $state('');
	const shown = $derived(
		markets.filter((market) => market.kind === view && market.symbol.includes(query.toUpperCase()))
	);
</script>

<!-- A full-height panel: the tabs and the filter stay, the table scrolls under its header. -->
<div class="markets">
	<Tabs fill aria-label="Markets" items={views} bind:value={view}>
		{#snippet panel()}
			<TextField label="Filter" type="search" size="sm" bind:value={query} />
			<Table aria-label="Markets" items={shown} {columns} size="xs" density="dense" />
		{/snippet}
	</Tabs>
</div>

<style>
	.markets {
		block-size: 100dvh;
	}
</style>
