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
	// The toasts of a subtree, and the outlet that shows them while no modal dialog is open.
	import { useDefaults } from '../defaults/context.js';
	import { setToasts, Toasts, type ToastDefaults } from './toast.svelte.js';
	import ToastOutlet from './ToastOutlet.svelte';

	let { children }: ToastProviderProps = $props();

	const resolve = useDefaults<ToastDefaults>('Toast', {
		color: 'neutral',
		duration: 6000,
		density: 'default',
		rounded: true
	});
	const toasts = setToasts(new Toasts(() => resolve({})));
</script>

{@render children?.()}
<ToastOutlet {toasts} outlet={toasts.base} />
