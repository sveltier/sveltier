<script lang="ts">
	import { Avatar, Card, Chip, List, ListItem, SegmentedControl } from 'sveltier';

	type Period = '1D' | '1W' | '1M' | '1Y';

	const periods = (['1D', '1W', '1M', '1Y'] as const).map((value) => ({ value, label: value }));
	const holdings = [
		{ id: 'eq', name: 'World equity', detail: '62% · index fund', value: '$153,894.10' },
		{ id: 'bd', name: 'Treasury bonds', detail: '24% · 4.1% yield', value: '$59,565.68' },
		{ id: 'cs', name: 'Cash reserve', detail: '14% · instant access', value: '$34,730.57' }
	];

	let period = $state<Period>('1D');
</script>

<Card title="Portfolio" subtitle="All accounts · USD" level={3}>
	{#snippet append()}<Chip color="up" size="sm">+2.4% today</Chip>{/snippet}
	<p class="total">$248,190<span>.35</span></p>
	<SegmentedControl options={periods} bind:value={period} size="sm" aria-label="Period" />
	<List density="compact">
		{#each holdings as item (item.id)}
			<ListItem title={item.name} subtitle={item.detail}>
				{#snippet prepend()}<Avatar size="sm">{item.id.toUpperCase()}</Avatar>{/snippet}
				{#snippet append()}<span class="value">{item.value}</span>{/snippet}
			</ListItem>
		{/each}
	</List>
</Card>

<style>
	.total {
		margin: 0;
		font: var(--sv-weight-display) var(--sv-text-headline) / 1 var(--sv-font-display);
		letter-spacing: var(--sv-tracking-display);
		font-variant-numeric: tabular-nums;
	}

	.total span,
	.value {
		color: var(--sv-color-text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
