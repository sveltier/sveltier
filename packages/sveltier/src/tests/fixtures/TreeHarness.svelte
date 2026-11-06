<script lang="ts">
	// Watchlists in folders, one of them disabled. Shows the selected node, what was selected
	// and what is open.
	import { untrack } from 'svelte';
	import { Tree, type TreeItem } from '../../lib/index.js';

	let {
		value = null,
		expanded = [],
		dir
	}: { value?: string | null; expanded?: string[]; dir?: 'ltr' | 'rtl' } = $props();

	const items: TreeItem[] = [
		{
			value: 'crypto',
			label: 'Crypto',
			children: [
				{ value: 'btc', label: 'BTC/USDT' },
				{ value: 'eth', label: 'ETH/USDT' },
				{ value: 'alts', label: 'Altcoins', children: [{ value: 'sol', label: 'SOL/USDT' }] }
			]
		},
		{ value: 'fx', label: 'FX', children: [{ value: 'eurusd', label: 'EUR/USD' }] },
		{ value: 'archived', label: 'Archived', disabled: true },
		{ value: 'empty', label: 'Empty', children: [] }
	];

	let selected = $state(untrack(() => value));
	let open = $state(untrack(() => expanded));
	let chosen = $state('');
</script>

<button type="button">Before</button>
<div {dir}>
	<Tree
		aria-label="Watchlists"
		{items}
		bind:value={selected}
		bind:expanded={open}
		onselect={(item) => (chosen = item.label)}
	/>
</div>
<p data-testid="value">{selected}</p>
<p data-testid="chosen">{chosen}</p>
<p data-testid="expanded">{open.join(',')}</p>
