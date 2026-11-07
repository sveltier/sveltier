<script lang="ts">
	// Columns built from a list of venues, all drawn by one snippet that reads its column.
	import Table from '../../lib/components/Table/Table.svelte';
	import type { TableColumn } from '../../lib/components/Table/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	interface Row {
		symbol: string;
		funding: Record<string, number>;
	}
	const venues = ['binance', 'bybit', 'okx'];
	const rows: Row[] = [
		{ symbol: 'BTC', funding: { binance: 0.01, bybit: 0.02, okx: 0.03 } },
		{ symbol: 'ETH', funding: { binance: 0.04, bybit: 0.05, okx: 0.06 } }
	];
	const columns: TableColumn<Row>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		...venues.map((venue): TableColumn<Row> => ({ id: venue, label: venue, cell: rate }))
	];
</script>

{#snippet rate(row: Row, column: TableColumn<Row>)}
	<a href="/chart/{column.id}/{row.symbol}">{row.funding[column.id ?? '']}%</a>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Table aria-label="Funding" items={rows} {columns} />
</ThemeProvider>
