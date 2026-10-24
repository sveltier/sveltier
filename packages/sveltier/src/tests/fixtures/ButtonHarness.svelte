<script lang="ts">
	// A Button in a themed scope, with optional defaults, icons and a form around it.
	import Button from '../../lib/components/Button/Button.svelte';
	import type { ButtonProps } from '../../lib/components/Button/types.js';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		label = 'Pay now',
		defaults = {},
		withPrepend = false,
		withAppend = false,
		inForm = false,
		onsubmit,
		ref = $bindable(null),
		...props
	}: ButtonProps & {
		label?: string;
		defaults?: DefaultsConfig;
		withPrepend?: boolean;
		withAppend?: boolean;
		inForm?: boolean;
		onsubmit?: () => void;
	} = $props();
</script>

{#snippet arrow()}
	<svg viewBox="0 0 16 16" aria-hidden="true" data-testid="icon"
		><path d="M3 8h10M9 4l4 4-4 4" /></svg
	>
{/snippet}

{#snippet button()}
	<Button
		{...props}
		bind:ref
		data-testid="button"
		prepend={withPrepend ? arrow : undefined}
		append={withAppend ? arrow : undefined}
	>
		{#if props.icon}{@render arrow()}{:else}{label}{/if}
	</Button>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<DefaultsProvider {defaults}>
		{#if inForm}
			<form
				onsubmit={(event) => {
					event.preventDefault();
					onsubmit?.();
				}}
			>
				<input aria-label="Amount" name="amount" />
				{@render button()}
			</form>
		{:else}
			{@render button()}
		{/if}
		<span data-testid="ref">{ref?.tagName ?? ''}</span>
	</DefaultsProvider>
</ThemeProvider>
