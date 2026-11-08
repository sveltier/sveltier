<script lang="ts">
	import { Button, Table, type TableColumn } from '@sveltier/ui';

	type Payment = { id: string; payee: string; amount: number };
	let {
		payments,
		loading,
		onretry
	}: { payments: Payment[]; loading: boolean; onretry: () => void } = $props();

	const columns: TableColumn<Payment>[] = [
		{ key: 'payee', label: 'Payee' },
		{ key: 'amount', label: 'Amount', format: (amount) => amount.toFixed(2) }
	];
</script>

<!-- While loading, a bar runs along the top and the empty row says "Loading". -->
<Table caption="Payments" {columns} items={payments} itemKey="id" {loading}>
	{#snippet empty()}
		Nothing yet. <Button size="sm" variant="text" onclick={onretry}>Check again</Button>
	{/snippet}
</Table>
