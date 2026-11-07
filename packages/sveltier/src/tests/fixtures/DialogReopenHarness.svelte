<script lang="ts">
	// A Dialog with no trigger, opened and closed by its `open` prop alone, as an app does from a
	// shortcut or a store.
	import Dialog from '../../lib/components/Dialog/Dialog.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Dialog title="Rename the account" bind:open>
		<label>Name <input name="name" /></label>
	</Dialog>
</ThemeProvider>
