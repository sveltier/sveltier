<!-- +layout.svelte: your own thresholds, and the width the server assumes -->
<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';

	let { data, children } = $props();
</script>

<UIProvider
	themes={monolith}
	display={{ thresholds: { md: 1024 }, mobileBreakpoint: 'lg', ssrWidth: data.viewportWidth }}
>
	{@render children()}
</UIProvider>
