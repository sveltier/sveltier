<script lang="ts">
	// A field with no hint and a short button right under it, whose clicks are counted. The line
	// a message adds under the field would move the button between a press and its release.
	import FileField from '../../lib/components/FileField/FileField.svelte';
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { file = false }: { file?: boolean } = $props();
	let clicks = $state(0);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	{#if file}
		<FileField label="Backup" accept=".json" />
	{:else}
		<TextField label="Email" type="email" />
	{/if}
	<button type="button" class="below" onclick={() => clicks++}>Save</button>
	<span data-testid="clicks">{clicks}</span>
</ThemeProvider>

<style>
	.below {
		display: block;
		block-size: 1.5rem;
		padding-block: 0;
	}
</style>
