<script>
	import { ThemeProvider, UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
</script>

<UIProvider themes={monolith}>
	<p>The page follows the user's choice.</p>

	<ThemeProvider theme="monolith-dark" withBackground class="card">
		<p>This card is always dark.</p>
	</ThemeProvider>
</UIProvider>
