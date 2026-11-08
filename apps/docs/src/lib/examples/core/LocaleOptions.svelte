<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
	// A user setting: changing it reformats every amount in the app.
	let currency = $state('EUR');
</script>

<UIProvider themes={monolith} locale={{ locale: 'en-IE', currency, timeZone: 'Europe/Dublin' }}>
	{@render children()}
</UIProvider>
