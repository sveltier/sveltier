<script lang="ts">
	// Tabs that are links between pages, the current one given as the value, in a themed scope.
	import Tabs from '../../lib/components/Tabs/Tabs.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = 'lessons' }: { value?: string } = $props();
	const ITEMS = [
		{ value: 'lessons', label: 'Lessons', href: '#lessons' },
		{ value: 'lab', label: 'Lab', href: '#lab' },
		{ value: 'exercise', label: 'Exercise', href: '#exercise', disabled: true }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Tabs aria-label="Learn" items={ITEMS} {value}>
		{#snippet panel()}<p data-testid="panel">Not shown</p>{/snippet}
	</Tabs>
</ThemeProvider>
