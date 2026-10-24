<script lang="ts">
	// A linear and a circular progress indicator with the same settings, in a themed scope.
	import ProgressCircular from '../../lib/components/Progress/ProgressCircular.svelte';
	import ProgressLinear from '../../lib/components/Progress/ProgressLinear.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value,
		indeterminate = false,
		label,
		dir = 'ltr'
	}: { value?: number; indeterminate?: boolean; label?: string; dir?: 'ltr' | 'rtl' } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div {dir} style="inline-size: 200px">
		<ProgressLinear data-testid="linear" {value} {indeterminate} {label} />
		<ProgressCircular data-testid="circular" {value} {indeterminate} {label}>
			{value}%
		</ProgressCircular>
	</div>
</ThemeProvider>
