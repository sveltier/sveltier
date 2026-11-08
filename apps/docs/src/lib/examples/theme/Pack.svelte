<script>
	import { UIProvider } from '@sveltier/ui';
	import { maison } from '@sveltier/ui/themes/maison';
	let { children } = $props();
</script>

<UIProvider themes={maison}>
	{@render children()}
</UIProvider>
