<script lang="ts">
	// An app whose content is exactly the window's height, as a full-window terminal is.
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<UIProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="block-size: 100dvh">Terminal</div>
</UIProvider>
