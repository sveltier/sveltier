<script lang="ts">
	// A list of ListItems. See ListProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './list.css';
	import type { ListDefaults, ListProps } from './types.js';

	let {
		density,
		color,
		nav,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ListProps = $props();

	const resolve = useDefaults<ListDefaults>('List', {
		density: 'default',
		color: 'primary',
		nav: false
	});
	const p = $derived(resolve({ density, color, nav }));
</script>

<!-- role="list": Safari drops the list semantics of a list without bullets. -->
<ul
	bind:this={ref}
	{...rest}
	role="list"
	class={[
		'sv-list',
		sharedClasses({ density: p.density, color: p.color }, 'List'),
		p.nav && 'sv-list--nav',
		className
	]}
>
	{@render children?.()}
</ul>
