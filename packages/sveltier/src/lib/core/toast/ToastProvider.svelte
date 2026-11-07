<script lang="ts" module>
	import type { Snippet } from 'svelte';

	/**
	 * Gives its subtree toasts: `useToast()` inside it shows them at the bottom of the screen.
	 * `<UIProvider>` already includes one; add it yourself only when the app uses
	 * `<ThemeProvider>` alone.
	 *
	 * @example
	 * <ThemeProvider themes={monolith}>
	 *   <ToastProvider>
	 *     {@render children()}
	 *   </ToastProvider>
	 * </ThemeProvider>
	 */
	export interface ToastProviderProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	// The toasts of a subtree, the live regions that read them out, and the outlet that shows
	// them while no modal dialog is open.
	import type { Component } from 'svelte';
	import { useDefaults } from '../defaults/context.js';
	import { setToasts, Toasts, type ToastDefaults } from './toast.svelte.js';
	import ToastLive from './ToastLive.svelte';

	let { children }: ToastProviderProps = $props();

	const resolve = useDefaults<ToastDefaults>('Toast', {
		color: 'neutral',
		duration: 6000,
		density: 'default',
		rounded: true,
		inset: 0
	});
	const toasts = setToasts(new Toasts(() => resolve({})));

	// The outlet, with the styles and the motion of the toasts, is not part of what every page
	// loads first: it loads once the page is idle, or as soon as a toast shows if that is sooner.
	// The live regions are here from the start, so the first toast is read out all the same.
	let Outlet = $state<Component<{ toasts: Toasts; outlet: object }> | null>(null);
	let loading: Promise<void> | undefined;
	function load() {
		loading ??= import('./ToastOutlet.svelte').then((module) => {
			Outlet = module.default;
		});
	}
	$effect(() => {
		if (toasts.list.length > 0) load();
	});
	$effect(() => {
		if (typeof requestIdleCallback !== 'function') {
			const timer = setTimeout(load, 200);
			return () => clearTimeout(timer);
		}
		const idle = requestIdleCallback(load, { timeout: 2000 });
		return () => cancelIdleCallback(idle);
	});
</script>

{@render children?.()}
<ToastLive {toasts} outlet={toasts.base} />
{#if Outlet}<Outlet {toasts} outlet={toasts.base} />{/if}
