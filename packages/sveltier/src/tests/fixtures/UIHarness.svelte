<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import UIProbe from './UIProbe.svelte';

	let props: Omit<ComponentProps<typeof UIProvider>, 'children' | 'themes'> = $props();
</script>

<UIProvider themes={monolith} storageKey={false} {...props}>
	<UIProbe />
</UIProvider>
