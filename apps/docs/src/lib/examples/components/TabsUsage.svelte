<script>
	import { Tabs } from '@sveltier/ui';
	let section = $state('overview');
</script>

<Tabs
	aria-label="Account"
	items={[
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' }
	]}
	bind:value={section}
>
	{#snippet panel(item)}
		{#if item.value === 'overview'}
			<p>Balance, limits and the account details.</p>
		{:else}
			<p>Payments in and out, newest first.</p>
		{/if}
	{/snippet}
</Tabs>
