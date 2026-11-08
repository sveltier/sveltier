<script lang="ts">
	import { Select } from '@sveltier/ui';

	let market = $state<string | null>(null);
</script>

<!-- Items with a group show under its name; a disabled one is skipped by the keys. -->
<Select
	label="Market"
	name="market"
	placeholder="Choose a market"
	required
	options={[
		{ value: 'btc-usdt', label: 'BTC/USDT', group: 'Binance' },
		{ value: 'eth-usdt', label: 'ETH/USDT', group: 'Binance' },
		{ value: 'btc-usd', label: 'BTC/USD', group: 'Coinbase' },
		{ value: 'eth-usd', label: 'ETH/USD', group: 'Coinbase', disabled: true }
	]}
	bind:value={market}
/>
