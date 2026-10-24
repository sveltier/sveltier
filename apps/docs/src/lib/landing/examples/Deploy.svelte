<script lang="ts">
	import {
		Alert,
		Button,
		Card,
		Chip,
		Icon,
		List,
		ListItem,
		ProgressLinear,
		Tabs
	} from '@sveltier/ui';

	const CHECK = 'M3.5 12.6 5.3 10.8l4.1 4.1 9.3-9.3 1.8 1.8L9.4 18.5z';
	const tabs = [
		{ value: 'rollout', label: 'Rollout' },
		{ value: 'checks', label: 'Checks' }
	] as const;
	const checks = ['Type check', 'Unit tests', 'Bundle size'];

	let tab = $state<(typeof tabs)[number]['value']>('rollout');
</script>

<Card title="Production" subtitle="main · 3f2a1c9" level={3}>
	{#snippet append()}<Chip color="success" size="sm">Live</Chip>{/snippet}
	<Tabs items={tabs} bind:value={tab} aria-label="Deployment">
		{#snippet panel(item)}
			{#if item.value === 'rollout'}
				<ProgressLinear value={72} label="Rollout" />
				<p class="meta">72% of regions · eu-west next</p>
			{:else}
				<List density="compact">
					{#each checks as check (check)}
						<ListItem title={check}>
							{#snippet prepend()}<Icon path={CHECK} color="success" />{/snippet}
						</ListItem>
					{/each}
				</List>
			{/if}
		{/snippet}
	</Tabs>
	<Alert type="success" density="compact" title="Build passed">Ready in 48 seconds.</Alert>
	{#snippet actions()}
		<Button>Promote</Button>
		<Button variant="text">Roll back</Button>
	{/snippet}
</Card>

<style>
	.meta {
		margin: var(--sv-space-8) 0 0;
		color: var(--sv-color-text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
