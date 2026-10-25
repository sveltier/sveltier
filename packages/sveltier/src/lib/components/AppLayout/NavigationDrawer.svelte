<script lang="ts">
	// The app's navigation: beside the content from its breakpoint up, a modal drawer below it.
	// See NavigationDrawerProps.
	import { MediaQuery } from 'svelte/reactivity';
	import { checkValue, DEV, warnMisplaced } from '#dev';
	import { BREAKPOINTS, DEFAULT_THRESHOLDS } from '../../core/display/display.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Modal from '../Modal/Modal.svelte';
	import '../Sheet/sheet.css';
	import { slide } from '../Sheet/slide.js';
	import { getLayout, type LayoutDrawer } from './context.svelte.js';
	import './navigation-drawer.css';
	import type { NavigationDrawerProps } from './types.js';

	let {
		open = $bindable(false),
		rail = false,
		breakpoint = 'md',
		children,
		'aria-label': ariaLabel,
		class: className,
		ref = $bindable(null),
		...rest
	}: NavigationDrawerProps = $props();

	if (DEV) $effect(() => checkValue('NavigationDrawer', 'breakpoint', breakpoint, BREAKPOINTS));

	const uid = $props.id();
	const locale = useLocale();
	const label = $derived(ariaLabel ?? locale.t('mainNavigation'));

	// Modal below the breakpoint's default width, the width at which the CSS takes the drawer out
	// of the grid. The server renders the drawer beside the content, hidden below that width.
	const narrow = $derived(
		breakpoint === 'xs' ? null : new MediaQuery(`(width < ${DEFAULT_THRESHOLDS[breakpoint]}px)`)
	);
	const modal = $derived(narrow?.current ?? false);

	$effect.pre(() => {
		if (!modal && open) open = false;
	});

	// The app bar's menu button opens it.
	const layout = getLayout();
	if (DEV && layout) $effect(() => warnMisplaced('NavigationDrawer', ref));
	if (layout) {
		const drawer: LayoutDrawer = {
			get open() {
				return open;
			},
			id: `${uid}-modal`,
			toggle() {
				open = !open;
			}
		};
		layout.drawer = drawer;
		$effect(() => () => {
			if (layout.drawer === drawer) layout.drawer = null;
		});
	}

	// A link inside the modal drawer leaves for another page: the drawer closes on the way. Not
	// for a link that opens elsewhere, downloads, or was handled already.
	function follow(event: MouseEvent) {
		const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
		const plain =
			event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
		if (!link || !plain || event.defaultPrevented || link.hasAttribute('download')) return;
		if (!link.target || link.target === '_self') open = false;
	}
</script>

<nav
	bind:this={ref}
	aria-label={label}
	{...rest}
	class={[
		'sv-navigation-drawer',
		`sv-navigation-drawer--${breakpoint}`,
		rail && 'sv-navigation-drawer--rail',
		className
	]}
>
	{#if !modal}
		<div class="sv-navigation-drawer__content">{@render children?.()}</div>
	{/if}
</nav>
{#if modal}
	<Modal
		component="NavigationDrawer"
		placement="start"
		panelClass={['sv-navigation-drawer__panel', className]}
		enter={slide('start')}
		id="{uid}-modal"
		aria-label={locale.t('navigation')}
		returnFocus={layout?.menu}
		onclick={follow}
		bind:open
	>
		<nav class="sv-navigation-drawer__modal" aria-label={label}>{@render children?.()}</nav>
	</Modal>
{/if}
