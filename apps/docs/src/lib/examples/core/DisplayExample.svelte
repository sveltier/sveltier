<script>
	import { Table, useDisplay } from '@sveltier/ui';

	let { orders, columns } = $props();

	const display = useDisplay();
	// Behaviour, not layout: fewer rows per page on small screens.
	const pageSize = $derived(display.mdAndUp ? 50 : 20);
</script>

<Table aria-label="Orders" items={orders.slice(0, pageSize)} {columns} />
