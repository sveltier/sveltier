<script lang="ts">
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ThemeProbe from './ThemeProbe.svelte';
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<ThemeProbe label="outer" />
	<ThemeProvider theme="monolith-dark" withBackground data-testid="inner-scope">
		<ThemeProbe label="inner" />
	</ThemeProvider>
</ThemeProvider>
