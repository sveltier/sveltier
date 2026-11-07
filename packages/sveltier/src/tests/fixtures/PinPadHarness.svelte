<script lang="ts">
	// A PinPad in a themed form, with its bound value, what oncomplete got and the submitted data.
	import PinPad from '../../lib/components/PinPad/PinPad.svelte';
	import type { PinPadProps } from '../../lib/components/PinPad/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';

	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(''),
		withExtra = false,
		...props
	}: Partial<PinPadProps> & { withExtra?: boolean } = $props();
	let completed = $state<string[]>([]);
	let submitted = $state('');
</script>

{#snippet fingerprint()}<button type="button">Use fingerprint</button>{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<PinPad
			label="Enter your trading PIN"
			name="pin"
			length={4}
			oncomplete={(pin) => (completed = [...completed, pin])}
			extra={withExtra ? fingerprint : undefined}
			{...props}
			bind:value
		/>
		<button type="submit">Confirm</button>
	</form>
	<span data-testid="value">{value}</span>
	<span data-testid="completed">{completed.join(',')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
