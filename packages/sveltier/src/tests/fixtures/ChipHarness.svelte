<script lang="ts">
	// A chip in a themed scope, with its selected state shown beside it.
	import Chip from '../../lib/components/Chip/Chip.svelte';
	import type { ChipProps } from '../../lib/components/Chip/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		selected = $bindable(),
		withPrepend = false,
		...props
	}: ChipProps & { withPrepend?: boolean } = $props();
</script>

{#snippet dot()}
	<svg viewBox="0 0 24 24" data-testid="prepend"><circle cx="12" cy="12" r="6" /></svg>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Chip data-testid="chip" bind:selected prepend={withPrepend ? dot : undefined} {...props}>
		Euro
	</Chip>
	<span data-testid="state">{String(selected)}</span>
</ThemeProvider>
