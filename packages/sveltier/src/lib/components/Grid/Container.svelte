<script lang="ts">
	// The width of a page's content. See ContainerProps.
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { SIZES } from '../../core/props/types.js';
	import './grid.css';
	import type { ContainerDefaults, ContainerProps } from './types.js';

	let {
		size,
		fluid = false,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ContainerProps = $props();

	const resolve = useDefaults<ContainerDefaults>('Container', { size: 'lg' });
	const p = $derived(resolve({ size }));

	if (DEV) $effect(() => checkValue('Container', 'size', p.size, SIZES));
</script>

<div
	bind:this={ref}
	{...rest}
	class={['sv-container', `sv-container--${p.size}`, fluid && 'sv-container--fluid', className]}
>
	{@render children?.()}
</div>
