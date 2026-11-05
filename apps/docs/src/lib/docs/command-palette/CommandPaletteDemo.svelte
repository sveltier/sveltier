<script lang="ts">
	// Markets and pages in one palette, opened with its trigger or Ctrl+K (⌘K). The last command
	// run shows below.
	import { Button, CommandPalette, type CommandItem } from '@sveltier/ui';

	type Command = CommandItem & { href: string };

	// Simple geometric shapes on a 24-unit grid, drawn for these docs.
	const CHART = 'M4 4h2v14h14v2H4zm4 9 3-3 3 3 5-5 1.4 1.4L14 15.8l-3-3-1.6 1.6z';
	const COG =
		'M10 2h4l.6 3 2.4 1.4 2.9-1 2 3.4-2.3 2.1v2.2l2.3 2.1-2 3.4-2.9-1-2.4 1.4-.6 3h-4l-.6-3L7 17.6l-2.9 1-2-3.4 2.3-2.1v-2.2L2.1 8.8l2-3.4 2.9 1L9.4 5zm2 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6';
	const WALLET = 'M3 6h16v3h2v8h-2v3H3zm2 2v10h12v-1h-4v-6h4V8zm10 5v2h4v-2z';

	const commands: Command[] = [
		{
			label: 'BTC/USDT',
			description: 'Binance · Spot',
			icon: CHART,
			group: 'Markets',
			href: '/m/btc-usdt'
		},
		{
			label: 'ETH/USDT',
			description: 'Binance · Spot',
			icon: CHART,
			group: 'Markets',
			href: '/m/eth-usdt'
		},
		{
			label: 'SOL/USDT',
			description: 'OKX · Perpetual',
			icon: CHART,
			group: 'Markets',
			href: '/m/sol-usdt'
		},
		{
			label: 'XAU/USD',
			description: 'OANDA · Gold',
			icon: CHART,
			group: 'Markets',
			href: '/m/xau-usd'
		},
		{
			label: 'Portfolio',
			icon: WALLET,
			keywords: ['balances', 'positions'],
			group: 'Pages',
			href: '/portfolio'
		},
		{
			label: 'Settings',
			icon: COG,
			shortcut: 'Ctrl+,',
			keywords: ['preferences'],
			group: 'Pages',
			href: '/settings'
		}
	];

	let ran = $state('');
</script>

<div class="docs-demo">
	<CommandPalette
		label="Go to"
		placeholder="Markets and pages"
		items={commands}
		onselect={(command) => (ran = command.href)}
	>
		{#snippet trigger(attributes)}
			<Button {...attributes} variant="outlined">Search <kbd>Ctrl K</kbd></Button>
		{/snippet}
	</CommandPalette>
	<p class="docs-dim">Last command: <code>{JSON.stringify(ran)}</code></p>
</div>
