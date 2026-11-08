<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Position = { symbol: string; name: string; quantity: number; price: number };
	let { positions }: { positions: Position[] } = $props();

	// A key is a property of the items: a typo is a type error that lists the real ones.
	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
		{ key: 'name', label: 'Name', sort: true },
		{ key: 'quantity', label: 'Quantity', sort: true },
		{ key: 'price', label: 'Price', sort: true, format: (price) => price.toFixed(2) }
	];
</script>

<Table caption="Positions" {columns} items={positions} />
