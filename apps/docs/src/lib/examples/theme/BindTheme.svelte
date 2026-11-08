<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let theme = $state('system');
</script>

<UIProvider themes={monolith} bind:theme>…</UIProvider>
<p>Current choice: {theme}</p>
