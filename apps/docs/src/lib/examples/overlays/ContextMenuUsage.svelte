<script lang="ts">
	import { ContextMenu, Table, type TableColumn } from '@sveltier/ui';

	type Order = { id: string; symbol: string; size: number };
	let {
		orders,
		cancel,
		copy
	}: {
		orders: Order[];
		cancel: (id: string) => void;
		copy: (id: string) => void;
	} = $props();

	const columns: TableColumn<Order>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'size', label: 'Size' }
	];
	// The order the menu opened on, from the row's data-id.
	let order = $state('');
</script>

<ContextMenu
	label="Order actions"
	items={[
		{ label: 'Copy id', value: 'copy' },
		{ separator: true },
		{ label: 'Cancel order', value: 'cancel', danger: true }
	]}
	onopen={(row) => (order = row.dataset.id ?? '')}
	onselect={(item) => (item.value === 'cancel' ? cancel(order) : copy(order))}
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
