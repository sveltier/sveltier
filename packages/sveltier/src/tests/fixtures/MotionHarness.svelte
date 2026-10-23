<script lang="ts">
	// A themed scope with an element that rises in and out.
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { rise } from '../../lib/primitives/motion/motion.js';
	import { monolith } from '../../lib/themes/monolith.js';

	let { shown = false }: { shown?: boolean } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div data-testid="scope">
		{#if shown}
			<p data-testid="card" transition:rise>Transfer sent</p>
		{/if}
	</div>
</ThemeProvider>
