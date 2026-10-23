<script lang="ts">
	import ThemeProviderSpike from '#lib/spike-theme/ThemeProviderSpike.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ThemeProviderSpike>
	{@render children()}
</ThemeProviderSpike>
