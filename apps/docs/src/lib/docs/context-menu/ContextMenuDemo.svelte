<script lang="ts">
	// Open orders in a Table, with one ContextMenu on every row: right-click a row to act on that
	// order. The menu's heading names the order it opened on.
	import { ContextMenu, Table, type MenuItem, type TableColumn } from '@sveltier/ui';

	type Order = { id: string; symbol: string; side: string; size: number; price: number };

	// Simple geometric shapes on a 24-unit grid, drawn for these docs.
	const COPY = 'M8 8h12v12H8zm2 2v8h8v-8zM4 4h12v2H6v10H4z';
	const CHART = 'M4 4h2v14h14v2H4zm4 9 3-3 3 3 5-5 1.4 1.4L14 15.8l-3-3-1.6 1.6z';
	const DELETE = 'M9 3h6v2h5v2H4V5h5zM6 8h12l-1 13H7z';

	let orders = $state<Order[]>([
		{ id: 'O-1042', symbol: 'BTC/USDT', side: 'Buy', size: 0.25, price: 67250 },
		{ id: 'O-1043', symbol: 'ETH/USDT', side: 'Sell', size: 4, price: 3480.5 },
		{ id: 'O-1044', symbol: 'SOL/USDT', side: 'Buy', size: 120, price: 152.18 }
	]);
	const columns: TableColumn<Order>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'side', label: 'Side' },
		{ key: 'size', label: 'Size' },
		{ key: 'price', label: 'Price', format: (price) => price.toFixed(2) }
	];

	let order = $state('');
	let done = $state('');
	const items: MenuItem[] = $derived([
		{ heading: order },
		{ label: 'Copy id', value: 'copy', icon: COPY, shortcut: 'Ctrl+C' },
		{ label: 'Open chart', value: 'chart', icon: CHART },
		{ separator: true },
		{ label: 'Cancel order', value: 'cancel', icon: DELETE, danger: true }
	]);

	function run(value: string | undefined) {
		if (value === 'cancel') orders = orders.filter((o) => o.id !== order);
		done = `${value} ${order}`;
	}
</script>

<div class="docs-demo">
	<ContextMenu
		label="Order actions"
		{items}
		onopen={(row) => (order = row.dataset.id ?? '')}
		onselect={(item) => run(item.value)}
	>
		{#snippet target(attributes)}
			<Table
				caption="Open orders"
				{columns}
				items={orders}
				itemKey="id"
				rowAttributes={(o) => ({ ...attributes, 'data-id': o.id })}
			/>
		{/snippet}
	</ContextMenu>
	<p class="docs-dim">Last action: <code>{JSON.stringify(done)}</code></p>
</div>
