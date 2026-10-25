<script lang="ts">
	// Two tooltips on buttons in a themed scope, as in a toolbar, optionally inside an open
	// Dialog, with a plain button elsewhere on the page.
	import Button from '../../lib/components/Button/Button.svelte';
	import Dialog from '../../lib/components/Dialog/Dialog.svelte';
	import Tooltip from '../../lib/components/Tooltip/Tooltip.svelte';
	import type { TooltipProps } from '../../lib/components/Tooltip/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		open = $bindable(false),
		text = 'Copy the IBAN',
		label = 'Copy',
		inDialog = false,
		iconOnly = false,
		nextDelay,
		nextOpen = false,
		...props
	}: Partial<TooltipProps> & {
		label?: string;
		inDialog?: boolean;
		/** An icon instead of the first button's text. */
		iconOnly?: boolean;
		/** The delay of the second tooltip. */
		nextDelay?: number;
		/** Shows the second tooltip from the start. */
		nextOpen?: boolean;
	} = $props();
</script>

{#snippet tools()}
	<div style="display: flex; gap: 8px; padding: 80px 120px">
		<Tooltip {text} {...props} bind:open>
			{#snippet trigger(attributes)}
				<Button {...attributes} aria-label={label}>
					{#if iconOnly}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h12v12H2z" /></svg
						>{:else}C{/if}
				</Button>
			{/snippet}
		</Tooltip>
		<Tooltip text="Share the statement" delay={nextDelay} open={nextOpen}>
			{#snippet trigger(attributes)}<Button {...attributes}>Share</Button>{/snippet}
		</Tooltip>
	</div>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	{#if inDialog}
		<Dialog title="Account" open>
			{@render tools()}
		</Dialog>
	{:else}
		{@render tools()}
	{/if}
	<button type="button">Elsewhere</button>
</ThemeProvider>
