<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import ThemeProbe from './ThemeProbe.svelte';

	let props: Omit<ComponentProps<typeof ThemeProvider>, 'children'> = $props();
</script>

<ThemeProvider {...props}>
	<ThemeProbe />
</ThemeProvider>
