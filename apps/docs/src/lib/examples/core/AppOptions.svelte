<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
</script>

<UIProvider
	themes={monolith}
	defaults={{ global: { density: 'compact' } }}
	locale={{ locale: 'en-GB', currency: 'GBP', timeZone: 'Europe/London' }}
	display={{ mobileBreakpoint: 'lg' }}
>
	{@render children()}
</UIProvider>
