<script lang="ts">
	// A full-height panel of 300px: tabs over a filter row and a long table, as a markets list.
	import Table from '../../lib/components/Table/Table.svelte';
	import type { TableColumn } from '../../lib/components/Table/types.js';
	import Tabs from '../../lib/components/Tabs/Tabs.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	interface Row {
		symbol: string;
		price: number;
	}
	const rows: Row[] = Array.from({ length: 60 }, (_, i) => ({ symbol: `COIN${i}`, price: i }));
	const columns: TableColumn<Row>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'price', label: 'Price' }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div data-testid="frame" style="block-size: 300px; display: flex; flex-direction: column;">
		<Tabs
			fill
			aria-label="Markets"
			items={[
				{ value: 'tickers', label: 'Tickers' },
				{ value: 'funding', label: 'Funding' }
			]}
		>
			{#snippet panel()}
				<p data-testid="filters">Filters</p>
				<Table aria-label="Tickers" items={rows} {columns} />
			{/snippet}
		</Tabs>
	</div>
</ThemeProvider>
