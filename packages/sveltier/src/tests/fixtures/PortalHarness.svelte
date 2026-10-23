<script lang="ts">
	// Content portaled out of a nested dark scope must keep its contexts and its look.
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import Portal from '../../lib/primitives/portal/Portal.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ThemeProbe from './ThemeProbe.svelte';

	let { open = true, into }: { open?: boolean; into?: string } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div data-testid="host">
		<ThemeProvider theme="monolith-dark" withBackground>
			{#if open}
				<Portal target={into}><ThemeProbe label="portaled" /></Portal>
			{/if}
		</ThemeProvider>
	</div>
	<div id="portal-target" data-testid="target"></div>
</ThemeProvider>
