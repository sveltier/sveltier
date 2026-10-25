<script lang="ts">
	// The toast buttons inside a UIProvider, with its defaults.
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import ToastButtons from './ToastButtons.svelte';

	let { duration, defaults }: { duration?: number; defaults?: DefaultsConfig } = $props();
</script>

<UIProvider themes={monolith} theme="monolith-light" storageKey={false} {defaults}>
	<ToastButtons {duration} />
</UIProvider>
