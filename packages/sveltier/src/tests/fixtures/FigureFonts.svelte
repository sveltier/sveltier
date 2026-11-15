<script lang="ts">
	// Figures in a themed scope: each component that shows one, then the same figures in a part
	// of the page set to the font of its text.
	import Amount from '../../lib/components/Amount/Amount.svelte';
	import Delta from '../../lib/components/Delta/Delta.svelte';
	import NumberField from '../../lib/components/NumberField/NumberField.svelte';
	import Odometer from '../../lib/components/Odometer/Odometer.svelte';
	import Table from '../../lib/components/Table/Table.svelte';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { font }: { font?: 'data' | 'inherit' } = $props();
	const items = [{ symbol: 'AAPL', price: 131.26 }];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<p data-testid="text">
		Up <Amount data-testid="amount" value={131.26} {font} /> today,
		<Delta data-testid="delta" value={1.5} {font} />, total
		<Odometer data-testid="odometer" value={1734.93} {font} />.
	</p>
	<NumberField label="Quantity" value={100} />
	<Table
		aria-label="Prices"
		{items}
		columns={[
			{ key: 'symbol', label: 'Symbol' },
			{ key: 'price', label: 'Price' }
		]}
	/>
	<DefaultsProvider defaults={{ Amount: { font: 'inherit' } }}>
		<p>
			<Amount data-testid="prose-amount" value={42} />
			<Delta data-testid="prose-delta" value={-2} />
			<Odometer data-testid="prose-odometer" value={7} />
		</p>
	</DefaultsProvider>
</ThemeProvider>
