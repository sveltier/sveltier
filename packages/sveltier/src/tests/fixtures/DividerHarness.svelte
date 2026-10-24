<script lang="ts">
	// Dividers between stacked items and between items in a row, in a themed scope.
	import Divider from '../../lib/components/Divider/Divider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="display: grid; inline-size: 300px">
		<span>Balance</span>
		<Divider data-testid="horizontal" class="extra" />
		<span>Pending</span>
	</div>
	<div data-testid="row" style="display: flex; align-items: center; block-size: 40px">
		<span>Filter</span>
		<Divider vertical data-testid="vertical" />
		<span>Sort</span>
	</div>
</ThemeProvider>
