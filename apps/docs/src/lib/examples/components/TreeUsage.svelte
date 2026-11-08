<script lang="ts">
	import { Tree, type TreeItem } from '@sveltier/ui';
	import { mdiFolder, mdiFormatListBulleted } from '@mdi/js';

	const watchlists: TreeItem[] = [
		{
			value: 'crypto',
			label: 'Crypto',
			icon: mdiFolder,
			children: [
				{ value: 'majors', label: 'Majors', icon: mdiFormatListBulleted },
				{ value: 'defi', label: 'DeFi', icon: mdiFormatListBulleted }
			]
		},
		{
			value: 'fx',
			label: 'FX',
			icon: mdiFolder,
			children: [{ value: 'crosses', label: 'Crosses', icon: mdiFormatListBulleted }]
		},
		{ value: 'metals', label: 'Metals', icon: mdiFormatListBulleted }
	];
	let selected = $state<string | null>('majors');
	let open = $state(['crypto']);
</script>

<Tree aria-label="Watchlists" items={watchlists} bind:value={selected} bind:expanded={open} />
