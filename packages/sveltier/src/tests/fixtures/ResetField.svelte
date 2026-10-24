<script lang="ts">
	// A TextField with a hint under an app's own unlayered paragraph reset.
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<svelte:head>
	<style>
		p {
			margin: 0;
		}
	</style>
</svelte:head>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<TextField label="Email" hint="Receipts go here" />
</ThemeProvider>
