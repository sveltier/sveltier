<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Row = { symbol: string; funding: Record<string, number> };
	let { rows, venues }: { rows: Row[]; venues: string[] } = $props();

	// One column per venue the reader picked, all drawn by the same snippet.
	const columns: TableColumn<Row>[] = $derived([
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		...venues.map((venue): TableColumn<Row> => ({ id: venue, label: venue, cell: rate }))
	]);
</script>

{#snippet rate(row: Row, column: TableColumn<Row>)}
	<a href="/chart/{column.id}/{row.symbol}">{row.funding[column.id ?? '']}%</a>
{/snippet}

<Table aria-label="Funding" items={rows} {columns} />
