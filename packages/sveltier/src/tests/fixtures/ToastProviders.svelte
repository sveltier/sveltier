<script lang="ts">
	// A component that shows a toast on init, under UIProvider, under ThemeProvider with
	// ToastProvider, or under ThemeProvider alone.
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import ToastProvider from '../../lib/core/toast/ToastProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ToastOnInit from './ToastOnInit.svelte';

	let { root }: { root: 'ui' | 'toast' | 'theme' } = $props();
</script>

{#if root === 'ui'}
	<UIProvider themes={monolith} storageKey={false}><ToastOnInit /></UIProvider>
{:else if root === 'toast'}
	<ThemeProvider themes={monolith} storageKey={false}>
		<ToastProvider><ToastOnInit /></ToastProvider>
	</ThemeProvider>
{:else}
	<ThemeProvider themes={monolith} storageKey={false}><ToastOnInit /></ThemeProvider>
{/if}
