<script lang="ts">
	// A loading placeholder. See SkeletonProps for the props.
	import { sharedClasses } from '../../core/props/classes.js';
	import './skeleton.css';
	import type { SkeletonProps } from './types.js';

	let {
		type = 'text',
		lines = 1,
		size = 'md',
		class: className,
		ref = $bindable(null),
		...rest
	}: SkeletonProps = $props();

	const count = $derived(Math.max(1, Math.trunc(lines) || 1));
</script>

<span
	bind:this={ref}
	{...rest}
	aria-hidden="true"
	class={[
		'sv-skeleton',
		`sv-skeleton--${type}`,
		type === 'circle' && sharedClasses({ size }),
		className
	]}
>
	{#if type === 'text'}
		{#each { length: count }, line (line)}<span class="sv-skeleton__line"></span>{/each}
	{/if}
</span>
