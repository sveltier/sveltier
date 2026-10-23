<script lang="ts">
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import ThemeProbe from './ThemeProbe.svelte';
</script>

<ThemeProvider theme="bone" storageKey={false}>
	<ThemeProbe label="outer" />
	<ThemeProvider theme="ink" withBackground data-testid="inner-scope">
		<ThemeProbe label="inner" />
	</ThemeProvider>
</ThemeProvider>
