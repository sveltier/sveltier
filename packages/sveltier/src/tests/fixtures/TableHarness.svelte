<script lang="ts" module>
	export type Position = {
		symbol: string;
		quantity: number;
		price: number | null;
		status: 'open' | 'closed';
	};

	export const POSITIONS: Position[] = [
		{ symbol: 'VNM', quantity: 300, price: 61.2, status: 'open' },
		{ symbol: 'FPT', quantity: 1200, price: 118.5, status: 'open' },
		{ symbol: 'HPG', quantity: 50, price: null, status: 'closed' },
		{ symbol: 'ACB', quantity: 800, price: 24.75, status: 'open' }
	];
</script>

<script lang="ts">
	// Positions in a table, in a themed scope: a symbol that heads its row, numbers, a computed
	// value, a status shown by a snippet and a column of buttons. The test picks the props, and
	// sees the bound sort and the sorts reported by onsort.
	import Table from '../../lib/components/Table/Table.svelte';
	import type { TableColumn, TableProps, TableSort } from '../../lib/components/Table/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		items = POSITIONS,
		columns,
		sortBy = $bindable(),
		maxBlockSize,
		withEmpty = false,
		...props
	}: Partial<TableProps<Position>> & { maxBlockSize?: string; withEmpty?: boolean } = $props();

	let reported = $state<(TableSort | undefined)[]>([]);
</script>

{#snippet status(position: Position)}
	<b data-testid="status">{position.status}</b>
{/snippet}

{#snippet close(position: Position)}
	<button type="button">Close {position.symbol}</button>
{/snippet}

{#snippet nothing()}
	<span data-testid="empty">No positions yet</span>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Table
		data-testid="table"
		caption="Positions"
		{items}
		columns={columns ??
			([
				{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
				{ key: 'quantity', label: 'Quantity', sort: true },
				{ key: 'price', label: 'Price', sort: true, format: (price) => price.toFixed(2) },
				{ id: 'value', label: 'Value', value: (p) => (p.price ?? 0) * p.quantity, sort: true },
				{ key: 'status', label: 'Status', cell: status },
				{ id: 'actions', label: 'Actions', hideLabel: true, cell: close }
			] satisfies TableColumn<Position>[])}
		bind:sortBy
		onsort={(next) => reported.push(next)}
		empty={withEmpty ? nothing : undefined}
		style={maxBlockSize ? `max-block-size: ${maxBlockSize}` : undefined}
		{...props}
	/>
	<output data-testid="sort">{sortBy ? `${sortBy.column} ${sortBy.direction}` : 'none'}</output>
	<output data-testid="reported">
		{reported.map((sort) => (sort ? `${sort.column} ${sort.direction}` : 'none')).join(', ')}
	</output>
</ThemeProvider>
