<script lang="ts">
	// The bar across the top of an app. See AppBarProps.
	import type { Attachment } from 'svelte/attachments';
	import { DEV, warnMisplaced } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import Button from '../Button/Button.svelte';
	import './app-bar.css';
	import { getLayout } from './context.svelte.js';
	import type { AppBarDefaults, AppBarProps } from './types.js';

	let {
		density,
		sticky,
		title,
		children,
		actions,
		class: className,
		ref = $bindable(null),
		...rest
	}: AppBarProps = $props();

	const resolve = useDefaults<AppBarDefaults>('AppBar', { density: 'default', sticky: true });
	const p = $derived(resolve({ density, sticky }));
	const layout = getLayout();
	const locale = useLocale();
	if (DEV && layout) $effect(() => warnMisplaced('AppBar', ref));

	const MENU = 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z';

	// Focus goes back to the menu button when the drawer it opened closes.
	const menu: Attachment<HTMLElement> = (node) => {
		if (!layout) return;
		layout.menu = node;
		return () => {
			if (layout.menu === node) layout.menu = null;
		};
	};
</script>

<header
	bind:this={ref}
	{...rest}
	class={[
		'sv-app-bar',
		sharedClasses({ density: p.density }, 'AppBar'),
		p.sticky && 'sv-app-bar--sticky',
		className
	]}
>
	{#if layout}
		<!--
			The layout's CSS shows it while the drawer is modal, below the drawer's breakpoint. The
			drawer may render after the bar, so the button's state does not wait for it.
		-->
		<span class="sv-app-bar__menu">
			<Button
				icon
				variant="text"
				color="neutral"
				density={p.density}
				aria-label={locale.t('navigation')}
				aria-haspopup="dialog"
				aria-expanded={layout.drawer?.open ?? false}
				aria-controls={layout.drawer?.open ? layout.drawer.id : undefined}
				onclick={() => layout.drawer?.toggle()}
				{@attach menu}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={MENU} /></svg>
			</Button>
		</span>
	{/if}
	{#if title}<span class="sv-app-bar__title">{title}</span>{/if}
	{#if children}<div class="sv-app-bar__content">{@render children()}</div>{/if}
	{#if actions}<div class="sv-app-bar__actions">{@render actions()}</div>{/if}
</header>
