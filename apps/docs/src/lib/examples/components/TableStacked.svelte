<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Position = {
		symbol: string;
		company: string;
		quantity: number;
		average: number;
		price: number;
		change: number;
	};

	const POSITIONS: Position[] = [
		{
			symbol: 'AAPL',
			company: 'Apple Inc.',
			quantity: 120,
			average: 182.4,
			price: 191.6,
			change: 1.21
		},
		{
			symbol: 'MSFT',
			company: 'Microsoft Corporation',
			quantity: 40,
			average: 402.1,
			price: 398.3,
			change: -0.44
		},
		{
			symbol: 'NVDA',
			company: 'NVIDIA Corporation',
			quantity: 65,
			average: 118.9,
			price: 131.2,
			change: 2.87
		}
	];

	// Below 600px of its box, each row is a block: the symbol, the value and the change on the
	// first line, the company under the symbol, the average left out, and every other column as
	// its label and value.
	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
		{ key: 'company', label: 'Company', stack: 'secondary' },
		{ key: 'quantity', label: 'Quantity', sort: true },
		{
			key: 'average',
			label: 'Average',
			stack: 'hidden',
			format: (average) => average.toFixed(2)
		},
		{ key: 'price', label: 'Price', format: (price) => price.toFixed(2) },
		{
			key: 'change',
			label: 'Change',
			stack: 'primary',
			sort: true,
			format: (change) => `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
		},
		{
			id: 'value',
			label: 'Value',
			stack: 'primary',
			sort: true,
			value: (position) => position.quantity * position.price,
			format: (value: number) => value.toLocaleString('en', { maximumFractionDigits: 0 })
		}
	];
</script>

<Table caption="Positions" {columns} items={POSITIONS} itemKey="symbol" stack="sm" />
