<script lang="ts">
	// The app's main destinations along the bottom of a phone's screen. See BottomNavigationProps.
	import { checkValue, DEV, warnMisplaced } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { BREAKPOINTS } from '../../core/display/display.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './bottom-navigation.css';
	import { getLayout } from './context.svelte.js';
	import { scrollAway } from './scroll-away.js';
	import type { BottomNavigationDefaults, BottomNavigationProps } from './types.js';

	let {
		items,
		breakpoint = 'md',
		color = 'primary',
		hideOnScroll,
		'aria-label': ariaLabel,
		class: className,
		ref = $bindable(null),
		...rest
	}: BottomNavigationProps = $props();

	const resolve = useDefaults<BottomNavigationDefaults>('BottomNavigation', {
		hideOnScroll: false
	});
	const p = $derived(resolve({ hideOnScroll }));
	const locale = useLocale();
	const layout = getLayout();
	if (DEV) {
		$effect(() => checkValue('BottomNavigation', 'breakpoint', breakpoint, BREAKPOINTS.slice(1)));
		$effect(() =>
			checkValue('BottomNavigation', 'hideOnScroll', p.hideOnScroll, [
				true,
				false,
				...BREAKPOINTS.slice(1)
			])
		);
		if (layout) $effect(() => warnMisplaced('BottomNavigation', ref));
	}
</script>

<nav
	bind:this={ref}
	{...rest}
	aria-label={ariaLabel ?? locale.t('mainNavigation')}
	class={[
		'sv-bottom-navigation',
		`sv-bottom-navigation--${breakpoint}`,
		sharedClasses({ color }, 'BottomNavigation'),
		className
	]}
	{@attach p.hideOnScroll && scrollAway(p.hideOnScroll)}
>
	{#each items as item (item.href)}
		<a
			href={item.href}
			aria-current={item.current ? 'page' : undefined}
			class="sv-bottom-navigation__item"
		>
			<span class="sv-bottom-navigation__icon" aria-hidden="true">
				{#if typeof item.icon === 'string'}
					<svg viewBox="0 0 24 24" fill="currentColor"><path d={item.icon} /></svg>
				{:else}
					<item.icon />
				{/if}
			</span>
			<span class="sv-bottom-navigation__label">{item.label}</span>
		</a>
	{/each}
</nav>
