<!-- src/routes/+layout.svelte -->
<script>
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
</script>

<UIProvider themes={monolith}>{@render children()}</UIProvider>
