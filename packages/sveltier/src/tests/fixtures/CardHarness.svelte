<script lang="ts">
	// A card with every part, in a themed scope.
	import Card from '../../lib/components/Card/Card.svelte';
	import type { CardProps } from '../../lib/components/Card/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		full = true,
		wideAppend = false,
		...props
	}: CardProps & { full?: boolean; wideAppend?: boolean } = $props();
</script>

{#snippet avatar()}<span data-testid="prepend">AM</span>{/snippet}
{#snippet menu()}<button type="button">More</button>{/snippet}
{#snippet open()}<button type="button" data-testid="append" style="inline-size: 165px"
		>Open the full site</button
	>{/snippet}
{#snippet buttons()}<button type="button">Send money</button>{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="inline-size: 320px">
		{#if full}
			<Card
				data-testid="card"
				title="Savings"
				subtitle="Instant access"
				prepend={avatar}
				append={wideAppend ? open : menu}
				actions={buttons}
				{...props}
			>
				<p data-testid="body">$12,480.00</p>
			</Card>
		{:else}
			<Card data-testid="card" {...props}><p data-testid="body">Only content</p></Card>
		{/if}
	</div>
</ThemeProvider>
