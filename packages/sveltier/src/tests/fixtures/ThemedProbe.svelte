<script lang="ts">
	// A root provider as an app sets it up: Monolith registered unless the test passes others.
	import type { ComponentProps } from 'svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ThemeProbe from './ThemeProbe.svelte';

	let {
		themes = monolith,
		...props
	}: Omit<ComponentProps<typeof ThemeProvider>, 'children'> = $props();
</script>

<ThemeProvider {themes} {...props}>
	<ThemeProbe />
</ThemeProvider>
