<script lang="ts">
	// The status bar along the bottom of an app. See AppFooterProps.
	import { checkValue, DEV, warnMisplaced, warnUnstuck } from '#dev';
	import { BREAKPOINTS } from '../../core/display/display.js';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './app-footer.css';
	import { getLayout } from './context.svelte.js';
	import { scrollAway } from './scroll-away.js';
	import type { AppFooterDefaults, AppFooterProps } from './types.js';

	let {
		density,
		sticky,
		hideOnScroll,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: AppFooterProps = $props();

	const resolve = useDefaults<AppFooterDefaults>('AppFooter', {
		density: 'default',
		sticky: false,
		hideOnScroll: false
	});
	const p = $derived(resolve({ density, sticky, hideOnScroll }));
	const hiding = $derived(p.sticky && p.hideOnScroll);
	const layout = getLayout();
	if (DEV) {
		if (layout) $effect(() => warnMisplaced('AppFooter', ref));
		$effect(() =>
			checkValue('AppFooter', 'hideOnScroll', p.hideOnScroll, [
				true,
				false,
				...BREAKPOINTS.slice(1)
			])
		);
		$effect(() => warnUnstuck('AppFooter', p.hideOnScroll, p.sticky));
	}
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
	{@attach hiding && scrollAway(hiding)}
>
	{@render children?.()}
</footer>
