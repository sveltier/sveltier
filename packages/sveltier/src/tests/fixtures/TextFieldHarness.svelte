<script lang="ts">
	// A TextField in a themed scope, with its bound value shown, a field after it to move focus
	// to, and optionally a plain form around both.
	import Button from '../../lib/components/Button/Button.svelte';
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import type { TextFieldProps } from '../../lib/components/TextField/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(''),
		ref = $bindable(null),
		inForm = false,
		onsubmit,
		withIcon = false,
		withAction = false,
		...props
	}: TextFieldProps & {
		inForm?: boolean;
		onsubmit?: () => void;
		withIcon?: boolean;
		withAction?: boolean;
	} = $props();
</script>

{#snippet icon()}
	<svg viewBox="0 0 24 24" aria-hidden="true" data-testid="icon"
		><circle cx="12" cy="12" r="8" /></svg
	>
{/snippet}

{#snippet action()}
	<Button variant="text" size="sm">Show</Button>
{/snippet}

{#snippet field()}
	<TextField
		label="Email"
		{...props}
		bind:value
		bind:ref
		prepend={withIcon ? icon : undefined}
		append={withAction ? action : undefined}
	/>
	<input aria-label="Next" />
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	{#if inForm}
		<form
			onsubmit={(event) => {
				event.preventDefault();
				onsubmit?.();
			}}
		>
			{@render field()}
			<button type="submit">Send</button>
		</form>
	{:else}
		{@render field()}
	{/if}
	<span data-testid="value">{value}</span>
	<Button size="md">Same height</Button>
</ThemeProvider>
