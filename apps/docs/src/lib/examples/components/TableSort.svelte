<script lang="ts">
	import { Table, type TableColumn, type TableSort } from '@sveltier/ui';

	type Order = { id: string; placed: Date; status: 'open' | 'filled' | 'cancelled' };
	let { orders }: { orders: Order[] } = $props();

	const RANK = { open: 0, filled: 1, cancelled: 2 };
	const columns: TableColumn<Order>[] = [
		{ key: 'id', label: 'Order', rowHeader: true },
		{ key: 'placed', label: 'Placed', sort: true, format: (date) => date.toLocaleString() },
		// A comparator decides the order itself: open orders first.
		{ key: 'status', label: 'Status', sort: (a, b) => RANK[a.status] - RANK[b.status] }
	];

	// Bindable: newest first to begin with, then whatever the user clicks.
	let sortBy = $state<TableSort | undefined>({ column: 'placed', direction: 'descending' });
</script>

<Table caption="Orders" {columns} items={orders} bind:sortBy />
