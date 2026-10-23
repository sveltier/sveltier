<script lang="ts">
	// A skeleton in a 300px wide themed column, with 20px text.
	import Skeleton from '../../lib/components/Skeleton/Skeleton.svelte';
	import type { SkeletonProps } from '../../lib/components/Skeleton/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { ...props }: SkeletonProps = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="inline-size: 300px; font-size: 20px" aria-busy="true">
		<Skeleton data-testid="skeleton" {...props} />
	</div>
</ThemeProvider>
