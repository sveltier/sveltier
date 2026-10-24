<script lang="ts">
	// A list with a static row, a link row, a button row and a row with its own control.
	import List from '../../lib/components/List/List.svelte';
	import ListItem from '../../lib/components/List/ListItem.svelte';
	import type { ListProps } from '../../lib/components/List/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		onopen,
		active = false,
		disabled = false,
		...props
	}: ListProps & { onopen?: () => void; active?: boolean; disabled?: boolean } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="inline-size: 320px">
		<List data-testid="list" {...props}>
			<ListItem data-testid="static" title="Available" subtitle="Updated today" />
			<ListItem data-testid="link" title="Statements" href="/statements" {active} {disabled} />
			<ListItem data-testid="button" title="Open account" onclick={onopen} {disabled} />
			<ListItem data-testid="row" title="Card ending 4471">
				{#snippet append()}<button type="button">Freeze</button>{/snippet}
			</ListItem>
		</List>
	</div>
</ThemeProvider>
