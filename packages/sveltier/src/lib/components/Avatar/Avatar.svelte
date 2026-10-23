<script lang="ts">
	// An image with a fallback of initials or an icon. See AvatarProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './avatar.css';
	import type { AvatarDefaults, AvatarProps } from './types.js';

	let {
		size,
		variant,
		color,
		rounded,
		src,
		alt,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: AvatarProps = $props();

	const resolve = useDefaults<AvatarDefaults>('Avatar', {
		size: 'md',
		variant: 'tonal',
		color: 'neutral',
		rounded: 'full'
	});
	const p = $derived(resolve({ size, variant, color, rounded }));

	// The image that failed, so a new src gets its own chance.
	let failed = $state<string>();
	const image = $derived(src && src !== failed ? src : undefined);
</script>

<span
	bind:this={ref}
	{...rest}
	role={alt ? 'img' : undefined}
	aria-label={alt || undefined}
	aria-hidden={alt ? undefined : 'true'}
	class={['sv-avatar', sharedClasses(p), className]}
>
	{#if image}
		<img class="sv-avatar__image" src={image} alt="" onerror={() => (failed = image)} />
	{:else}
		{@render children?.()}
	{/if}
</span>
