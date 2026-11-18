<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Company = { symbol: string; name: string; price: number; change: number };

	let { companies }: { companies: Company[] } = $props();

	const columns: TableColumn<Company>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'name', label: 'Company', stack: 'secondary' },
		{ key: 'price', label: 'Price', stack: 'primary', format: (price) => price.toFixed(2) },
		{
			key: 'change',
			label: 'Change',
			stack: 'primary',
			format: (change) => `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
		}
	];
</script>

<!-- The symbol is the link; a press anywhere on the row, or on the block on a phone, follows it. -->
<Table
	caption="Companies"
	{columns}
	items={companies}
	itemKey="symbol"
	stack="sm"
	rowHref={(company) => `/companies/${company.symbol}`}
/>
