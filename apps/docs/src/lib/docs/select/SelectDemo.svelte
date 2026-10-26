<script lang="ts">
	// Markets grouped by venue, one of them suspended, each with its pair's full name.
	import { Select, type SelectItem } from '@sveltier/ui';

	const MARKETS: SelectItem<string>[] = [
		{ value: 'btc-usdt', label: 'BTC/USDT', description: 'Bitcoin', group: 'Binance' },
		{ value: 'eth-usdt', label: 'ETH/USDT', description: 'Ether', group: 'Binance' },
		{ value: 'sol-usdt', label: 'SOL/USDT', description: 'Solana', group: 'Binance' },
		{ value: 'btc-usd', label: 'BTC/USD', description: 'Bitcoin', group: 'Coinbase' },
		{
			value: 'eth-usd',
			label: 'ETH/USD',
			description: 'Ether · suspended',
			group: 'Coinbase',
			disabled: true
		},
		{ value: 'btc-eur', label: 'BTC/EUR', description: 'Bitcoin', group: 'Kraken' },
		{ value: 'eth-eur', label: 'ETH/EUR', description: 'Ether', group: 'Kraken' }
	];
	let market = $state<string | null>('eth-usdt');
</script>

<div class="docs-demo docs-ticket">
	<Select label="Market" placeholder="Choose a market" items={MARKETS} bind:value={market} />
	<p class="docs-dim">Value: {market ?? 'null'}</p>
</div>
