<script lang="ts">
	// Markets in groups by venue, one of them closed, in a Select inside a form, with the bound
	// value and the submitted form data shown and a field after it to tab to.
	import Select from '../../lib/components/Select/Select.svelte';
	import type { SelectItem, SelectProps } from '../../lib/components/Select/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(null), ...props }: Partial<SelectProps<string>> = $props();
	let submitted = $state('');
	let changes = $state<string[]>([]);

	const MARKETS: SelectItem<string>[] = [
		{ value: 'btc-usdt', label: 'BTC/USDT', group: 'Binance' },
		{ value: 'eth-usdt', label: 'ETH/USDT', group: 'Binance' },
		{ value: 'btc-usd', label: 'BTC/USD', description: 'Spot', group: 'Coinbase' },
		{ value: 'eth-usd', label: 'ETH/USD', group: 'Coinbase', disabled: true },
		{ value: 'sol-usd', label: 'SOL/USD', group: 'Coinbase' },
		{ value: 'eth-btc', label: 'ETH/BTC', group: 'Binance' }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<Select
			label="Market"
			name="market"
			placeholder="Choose a market"
			items={MARKETS}
			onchange={(next) => changes.push(next)}
			{...props}
			bind:value
		/>
		<input aria-label="Next" />
		<button type="submit">Send</button>
	</form>
	<span data-testid="value">{value ?? 'null'}</span>
	<span data-testid="changes">{changes.join(', ')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
