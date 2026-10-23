<script lang="ts">
	// A segmented control of chart ranges, with the value and the last change shown beside it.
	import SegmentedControl from '../../lib/components/SegmentedControl/SegmentedControl.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable('1M'),
		dir = 'ltr',
		disabledYear = false
	}: { value?: string; dir?: 'ltr' | 'rtl'; disabledYear?: boolean } = $props();

	let changed = $state('');
	const options = $derived([
		{ value: '1D', label: '1D' },
		{ value: '1W', label: '1W' },
		{ value: '1M', label: '1M' },
		{ value: '1Y', label: '1Y', disabled: disabledYear },
		{ value: 'All', label: 'All' }
	]);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div {dir}>
		<SegmentedControl
			data-testid="control"
			aria-label="Chart range"
			{options}
			bind:value
			onchange={(next) => (changed = next)}
		/>
		<span data-testid="value">{value}</span>
		<span data-testid="changed">{changed}</span>
	</div>
</ThemeProvider>
