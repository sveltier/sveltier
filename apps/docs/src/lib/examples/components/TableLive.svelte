<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Quote = { symbol: string; last: number; volume: number };
	let { quotes, selected = $bindable() }: { quotes: Quote[]; selected?: string } = $props();

	const columns: TableColumn<Quote>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true, cell: pick },
		{ key: 'last', label: 'Last', sort: true },
		{ key: 'volume', label: 'Volume', sort: true }
	];
</script>

{#snippet pick(quote: Quote)}
	<button type="button" onclick={() => (selected = quote.symbol)}>{quote.symbol}</button>
{/snippet}

<!-- Fresh quote objects arrive every second: itemKey keeps each row's element, the sort
     stays, and the header stays in view while the box scrolls. -->
<Table
	aria-label="Watchlist"
	{columns}
	items={quotes}
	itemKey="symbol"
	rowAttributes={(quote) => ({ 'aria-current': quote.symbol === selected })}
	density="compact"
	style="max-block-size: 24rem"
/>
