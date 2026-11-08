<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
</script>

<UIProvider themes={monolith} defaults={{ global: { density: 'compact', rounded: 'lg' } }}>
	{@render children()}
</UIProvider>
