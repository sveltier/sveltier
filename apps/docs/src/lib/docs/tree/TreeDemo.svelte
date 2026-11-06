<script lang="ts">
	// Watchlists in folders: open them with the chevrons or the arrow keys, select one with a
	// click or Enter. What is selected and open shows below.
	import { Tree, type TreeItem } from '@sveltier/ui';

	// Simple geometric shapes on a 24-unit grid, drawn for these docs.
	const FOLDER = 'M3 5h7l2 2h9v12H3z';
	const LIST = 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z';

	const watchlists: TreeItem[] = [
		{
			value: 'crypto',
			label: 'Crypto',
			icon: FOLDER,
			children: [
				{ value: 'majors', label: 'Majors', icon: LIST },
				{ value: 'defi', label: 'DeFi', icon: LIST },
				{
					value: 'perps',
					label: 'Perpetuals',
					icon: FOLDER,
					children: [
						{ value: 'okx-perps', label: 'OKX', icon: LIST },
						{ value: 'binance-perps', label: 'Binance', icon: LIST }
					]
				}
			]
		},
		{
			value: 'fx',
			label: 'FX',
			icon: FOLDER,
			children: [
				{ value: 'majors-fx', label: 'Major pairs', icon: LIST },
				{ value: 'crosses', label: 'Crosses', icon: LIST }
			]
		},
		{ value: 'metals', label: 'Metals', icon: LIST },
		{ value: 'archive', label: 'Archive', icon: FOLDER, disabled: true, children: [] }
	];

	let selected = $state<string | null>('majors');
	let open = $state(['crypto']);
</script>

<div class="docs-demo">
	<Tree aria-label="Watchlists" items={watchlists} bind:value={selected} bind:expanded={open} />
	<p class="docs-dim">
		Selected: <code>{JSON.stringify(selected)}</code> · open: <code>{JSON.stringify(open)}</code>
	</p>
</div>
