<script>
	import { ThemeProvider, ToastProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';

	let { children } = $props();
</script>

<!-- UIProvider includes it: add ToastProvider only to an app on ThemeProvider alone. -->
<ThemeProvider themes={monolith}>
	<ToastProvider>
		{@render children()}
	</ToastProvider>
</ThemeProvider>
