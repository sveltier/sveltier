<script lang="ts">
	import { Amount, Delta, Table, type TableColumn } from '@sveltier/ui';

	type Quote = { symbol: string; last: number; change: number };
	let { quotes }: { quotes: Quote[] } = $props();

	const columns: TableColumn<Quote>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'last', label: 'Last', sort: true, cell: last },
		{ key: 'change', label: 'Change', sort: true, cell: change }
	];
</script>

{#snippet last(quote: Quote)}
	<Amount value={quote.last} decimals={2} flash />
{/snippet}

{#snippet change(quote: Quote)}
	<Delta value={quote.change} format={{ style: 'percent' }} />
{/snippet}

<Table aria-label="Watchlist" {columns} items={quotes} itemKey="symbol" />
