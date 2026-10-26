<script lang="ts">
	// A price and its change in a themed scope, with masking set for the subtree through
	// DefaultsProvider, as an app's privacy switch would.
	import Amount from '../../lib/components/Amount/Amount.svelte';
	import Delta from '../../lib/components/Delta/Delta.svelte';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		price = 131.26,
		change = 4.06,
		masked = false
	}: { price?: number | null; change?: number | null; masked?: boolean } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<DefaultsProvider defaults={{ Amount: { masked } }}>
		<p>
			<Amount data-testid="price" value={price} decimals={2} flash />
			<Delta data-testid="change" value={change} decimals={2} arrow flash />
		</p>
	</DefaultsProvider>
</ThemeProvider>
