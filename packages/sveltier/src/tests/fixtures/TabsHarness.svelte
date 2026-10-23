<script lang="ts">
	// Account tabs with a panel per tab, in a themed scope, with the bound value shown.
	import Tabs from '../../lib/components/Tabs/Tabs.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(),
		activation = 'automatic',
		withPanel = true
	}: {
		value?: string;
		activation?: 'automatic' | 'manual';
		withPanel?: boolean;
	} = $props();

	const items = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' },
		{ value: 'statements', label: 'Statements', disabled: true },
		{ value: 'settings', label: 'Settings' }
	];
</script>

{#snippet content(item: { value: string; label: string })}
	<p data-testid="panel-content">{item.label} panel</p>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Tabs
		data-testid="tabs"
		aria-label="Account"
		{items}
		bind:value
		{activation}
		panel={withPanel ? content : undefined}
	/>
	<span data-testid="value">{value ?? ''}</span>
</ThemeProvider>
