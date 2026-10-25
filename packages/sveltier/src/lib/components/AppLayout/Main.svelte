<script lang="ts">
	// The main content of an AppLayout. See MainProps.
	import { DEV, warnMisplaced } from '#dev';
	import { getLayout } from './context.svelte.js';
	import type { MainProps } from './types.js';

	let { children, class: className, ref = $bindable(null), ...rest }: MainProps = $props();

	const layout = getLayout();
	if (DEV && layout) $effect(() => warnMisplaced('Main', ref));
</script>

<!-- The id is the layout's, made before any part renders, so the server's skip link points here. -->
<main bind:this={ref} {...rest} id={layout?.mainId} class={['sv-main', className]}>
	{@render children?.()}
</main>
