<!-- src/routes/+layout.svelte -->
<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
</script>

<!-- Monolith, light or dark following the OS -->
<UIProvider themes={monolith}>
	{@render children()}
</UIProvider>
