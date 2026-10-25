<script lang="ts">
	// A portfolio: positions sortable by their headers, a computed value and P&L, the selected
	// position's row marked, and controls for the density and the loading state.
	import {
		Delta,
		SegmentedControl,
		Switch,
		Table,
		type Density,
		type TableColumn,
		type TableSort
	} from '@sveltier/ui';

	type Position = {
		symbol: string;
		quantity: number;
		cost: number;
		price: number | null;
	};

	const POSITIONS: Position[] = [
		{ symbol: 'NVDA', quantity: 120, cost: 96.4, price: 131.26 },
		{ symbol: 'AAPL', quantity: 80, cost: 189.9, price: 226.05 },
		{ symbol: 'MSFT', quantity: 45, cost: 412.3, price: 398.1 },
		{ symbol: 'ASML', quantity: 12, cost: 702.15, price: 688.4 },
		{ symbol: 'TSM', quantity: 60, cost: 141.8, price: 187.32 },
		{ symbol: 'VOO', quantity: 30, cost: 470.2, price: 512.77 },
		{ symbol: 'KO', quantity: 150, cost: 61.05, price: null }
	];

	const money = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const pnlOf = (p: Position) => (p.price === null ? null : (p.price - p.cost) * p.quantity);

	let selected = $state('NVDA');
	let sortBy = $state<TableSort | undefined>({ column: 'value', direction: 'descending' });
	let density = $state<Density>('default');
	let loading = $state(false);

	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true, cell: symbol },
		{ key: 'quantity', label: 'Quantity', sort: true },
		{ key: 'price', label: 'Price', sort: true, format: (price) => money.format(price) },
		{
			id: 'value',
			label: 'Value',
			value: (p) => (p.price === null ? null : p.price * p.quantity),
			sort: true,
			format: (value: number) => money.format(value)
		},
		{ id: 'pnl', label: 'P&L', value: pnlOf, sort: true, cell: pnl }
	];
</script>

{#snippet symbol(p: Position)}
	<button
		type="button"
		class="docs-cell-button"
		aria-pressed={p.symbol === selected}
		onclick={() => (selected = p.symbol)}
	>
		{p.symbol}
	</button>
{/snippet}

{#snippet pnl(p: Position)}
	<Delta value={pnlOf(p)} decimals={2} />
{/snippet}

<div class="docs-demo">
	<div class="docs-table-controls">
		<SegmentedControl
			aria-label="Density"
			size="sm"
			options={[
				{ value: 'compact', label: 'Compact' },
				{ value: 'default', label: 'Default' },
				{ value: 'comfortable', label: 'Comfortable' }
			]}
			bind:value={density}
		/>
		<Switch label="Loading" bind:checked={loading} />
	</div>
	<Table
		caption="Positions"
		{columns}
		items={loading ? [] : POSITIONS}
		itemKey="symbol"
		bind:sortBy
		{density}
		{loading}
		hover
		rowAttributes={(p) => ({ 'aria-current': p.symbol === selected })}
		style="max-block-size: 18rem"
	/>
	<p class="docs-dim">
		Selected: {selected}. Sorted by {sortBy ? `${sortBy.column}, ${sortBy.direction}` : 'nothing'}.
	</p>
</div>
