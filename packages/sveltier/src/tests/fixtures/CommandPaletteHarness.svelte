<script lang="ts">
	// A palette over markets and pages, with a trigger and a field to start from. Shows what ran
	// and why it closed.
	import { Button, CommandPalette, type CommandItem } from '../../lib/index.js';

	type Command = CommandItem & { href: string };

	let {
		shortcut,
		filter,
		loading = false,
		items = [
			{ label: 'BTC/USDT', description: 'Binance', group: 'Markets', href: '/m/btc' },
			{ label: 'ETH/USDT', description: 'Binance', group: 'Markets', href: '/m/eth' },
			{ label: 'Hà Nội desk', group: 'Pages', href: '/desk', disabled: true },
			{ label: 'Settings', keywords: ['preferences'], group: 'Pages', href: '/settings' }
		]
	}: {
		shortcut?: string | false;
		filter?: false;
		loading?: boolean;
		items?: Command[];
	} = $props();

	let open = $state(false);
	let ran = $state('');
	let reason = $state('');
	let query = $state('');
</script>

<input aria-label="Notes" />
<CommandPalette
	label="Go to"
	placeholder="Search"
	{items}
	{shortcut}
	{filter}
	{loading}
	bind:open
	bind:query
	onselect={(command) => (ran = command.href)}
	onclose={(why) => (reason = why)}
>
	{#snippet trigger(attributes)}<Button {...attributes}>Search</Button>{/snippet}
</CommandPalette>
<p data-testid="open">{open}</p>
<p data-testid="ran">{ran}</p>
<p data-testid="reason">{reason}</p>
<p data-testid="query">{query}</p>
