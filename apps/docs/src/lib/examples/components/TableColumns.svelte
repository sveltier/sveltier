<script lang="ts">
	import { Button, Delta, Table, type TableColumn } from '@sveltier/ui';

	type Position = { symbol: string; quantity: number; cost: number; price: number };
	let { positions, onclose }: { positions: Position[]; onclose: (p: Position) => void } = $props();

	const pnlOf = (p: Position) => (p.price - p.cost) * p.quantity;

	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		// An id with a value: computed from the item, and sorted by that value.
		{ id: 'pnl', label: 'P&L', value: pnlOf, sort: true, cell: pnl },
		// An id with only a cell: content of its own, with a label for screen readers only.
		{ id: 'close', label: 'Close', hideLabel: true, cell: close }
	];
</script>

{#snippet pnl(p: Position)}
	<Delta value={pnlOf(p)} decimals={2} />
{/snippet}

{#snippet close(p: Position)}
	<Button size="sm" variant="text" onclick={() => onclose(p)}>Close {p.symbol}</Button>
{/snippet}

<Table aria-label="Open positions" {columns} items={positions} />
