<script lang="ts">
	// The status bar along the bottom of an app. See AppFooterProps.
	import { DEV, warnMisplaced } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './app-footer.css';
	import { getLayout } from './context.svelte.js';
	import type { AppFooterDefaults, AppFooterProps } from './types.js';

	let {
		density,
		sticky,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: AppFooterProps = $props();

	const resolve = useDefaults<AppFooterDefaults>('AppFooter', {
		density: 'default',
		sticky: false
	});
	const p = $derived(resolve({ density, sticky }));
	const layout = getLayout();
	if (DEV && layout) $effect(() => warnMisplaced('AppFooter', ref));
</script>

<footer
	bind:this={ref}
	{...rest}
	class={[
		'sv-app-footer',
		sharedClasses({ density: p.density }, 'AppFooter'),
		p.sticky && 'sv-app-footer--sticky',
		className
	]}
>
	{@render children?.()}
</footer>
