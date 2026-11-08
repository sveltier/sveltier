<script lang="ts">
	import { DefaultsProvider, Table, type TableColumn } from '@sveltier/ui';

	type Trade = { id: string; time: string; price: number; size: number };
	let { trades }: { trades: Trade[] } = $props();

	const columns: TableColumn<Trade>[] = [
		{ key: 'time', label: 'Time' },
		{ key: 'price', label: 'Price', format: (price) => price.toFixed(2) },
		{ key: 'size', label: 'Size' }
	];
</script>

<!-- Rows about 20px tall: one table, or every table and control under the provider. -->
<Table caption="Trades" {columns} items={trades} itemKey="id" size="xs" density="dense" />

<DefaultsProvider defaults={{ global: { size: 'xs', density: 'dense' } }}>
	<Table caption="Trades" {columns} items={trades} itemKey="id" />
</DefaultsProvider>
