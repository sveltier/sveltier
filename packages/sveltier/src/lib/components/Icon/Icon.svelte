<script lang="ts">
	// An icon from path data or any SVG of your own. See IconProps for the props.
	import { sharedClasses } from '../../core/props/classes.js';
	import './icon.css';
	import type { IconProps } from './types.js';

	let {
		path,
		viewBox = '0 0 24 24',
		size,
		color,
		label,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: IconProps = $props();
</script>

<span
	bind:this={ref}
	{...rest}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	class={[
		'sv-icon',
		sharedClasses({ size, color }, 'Icon'),
		color && 'sv-icon--colored',
		className
	]}
>
	{#if path}
		<svg class="sv-icon__paths" {viewBox} aria-hidden="true"><path d={path} /></svg>
	{:else}
		{@render children?.()}
	{/if}
</span>
