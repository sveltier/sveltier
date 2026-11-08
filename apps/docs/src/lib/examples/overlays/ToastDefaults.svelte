<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';

	let { children } = $props();
</script>

<!-- Every toast stays 8 seconds, unless show() says otherwise. -->
<UIProvider themes={monolith} defaults={{ Toast: { duration: 8000 } }}>
	{@render children()}
</UIProvider>
