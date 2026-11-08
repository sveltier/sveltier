<script lang="ts">
	// The toast buttons inside a UIProvider, with its defaults, and in an app frame with a footer
	// when the test asks for one.
	import AppFooter from '../../lib/components/AppLayout/AppFooter.svelte';
	import AppLayout from '../../lib/components/AppLayout/AppLayout.svelte';
	import Main from '../../lib/components/AppLayout/Main.svelte';
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ToastButtons from './ToastButtons.svelte';

	let {
		duration,
		defaults,
		footer = false
	}: { duration?: number; defaults?: DefaultsConfig; footer?: boolean } = $props();
</script>

<UIProvider themes={monolith} theme="monolith-light" storageKey={false} {defaults}>
	{#if footer}
		<AppLayout fill>
			<Main><ToastButtons {duration} /></Main>
			<AppFooter>Market open</AppFooter>
		</AppLayout>
	{:else}
		<ToastButtons {duration} />
	{/if}
</UIProvider>
