<script lang="ts">
	// Account sections as tabs, with a panel for the selected one.
	import { Tabs, type TabsItem } from '@sveltier/ui';

	const ITEMS: TabsItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' },
		{ value: 'statements', label: 'Statements' },
		{ value: 'loans', label: 'Loans', disabled: true }
	];
	const CONTENT: Record<string, string> = {
		overview: 'Balance $12,480.00 across three accounts.',
		activity: '14 payments this week, 2 still pending.',
		statements: 'September is ready. October closes on the 31st.'
	};
	let section = $state('overview');
</script>

<div class="docs-demo">
	<Tabs aria-label="Account" items={ITEMS} bind:value={section}>
		{#snippet panel(item)}
			<p class="docs-tabs-panel">{CONTENT[item.value]}</p>
		{/snippet}
	</Tabs>
</div>
