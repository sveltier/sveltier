<script lang="ts">
	// A button inside the root provider, as an app sets it up.
	import Button from '../../lib/components/Button/Button.svelte';
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<UIProvider themes={monolith} storageKey={false}><Button>Buy</Button></UIProvider>
