<script lang="ts">
	// An alert in a themed scope, with its open state shown beside it.
	import Alert from '../../lib/components/Alert/Alert.svelte';
	import type { AlertProps } from '../../lib/components/Alert/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		open = $bindable(true),
		withActions = false,
		withPrepend = false,
		...props
	}: AlertProps & { withActions?: boolean; withPrepend?: boolean } = $props();
</script>

{#snippet retry()}<button type="button">Retry</button>{/snippet}
{#snippet star()}<svg viewBox="0 0 24 24" data-testid="custom-icon"
		><circle cx="12" cy="12" r="8" /></svg
	>{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Alert
		data-testid="alert"
		bind:open
		actions={withActions ? retry : undefined}
		prepend={withPrepend ? star : undefined}
		{...props}
	>
		The transfer could not be sent.
	</Alert>
	<span data-testid="open">{String(open)}</span>
</ThemeProvider>
