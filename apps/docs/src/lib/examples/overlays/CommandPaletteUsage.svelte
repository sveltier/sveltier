<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, CommandPalette, type CommandItem } from '@sveltier/ui';

	// Commands carry their own fields: onselect receives them typed.
	type Command = CommandItem & { href: string };
	const commands: Command[] = [
		{ label: 'BTC/USDT', description: 'Binance · Spot', group: 'Markets', href: '/m/btc-usdt' },
		{ label: 'ETH/USDT', description: 'Binance · Spot', group: 'Markets', href: '/m/eth-usdt' },
		{ label: 'Portfolio', keywords: ['balances'], group: 'Pages', href: '/portfolio' },
		{ label: 'Settings', keywords: ['preferences'], group: 'Pages', href: '/settings' }
	];
</script>

<!-- Ctrl+K (⌘K on a Mac) opens it from anywhere on the page, as does the button. -->
<CommandPalette label="Go to" items={commands} onselect={(command) => goto(command.href)}>
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Search <kbd>Ctrl K</kbd></Button>
	{/snippet}
</CommandPalette>
