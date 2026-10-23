<script lang="ts">
	// A chart range picker, a flat variant in the primary colour, and a disabled option.
	import { SegmentedControl } from 'sveltier';

	const RANGES = [
		{ value: '1D', label: '1D' },
		{ value: '1W', label: '1W' },
		{ value: '1M', label: '1M' },
		{ value: '1Y', label: '1Y' },
		{ value: 'All', label: 'All' }
	];
	const VIEWS = [
		{ value: 'list', label: 'List' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'map', label: 'Map', disabled: true }
	];
	let range = $state('1M');
	let view = $state('list');
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<SegmentedControl aria-label="Chart range" options={RANGES} bind:value={range} />
	</div>
	<div class="docs-actions">
		<SegmentedControl
			aria-label="View"
			options={VIEWS}
			bind:value={view}
			variant="flat"
			color="primary"
			size="sm"
		/>
	</div>
	<p class="docs-dim" aria-live="polite">Showing {range} as a {view}.</p>
</div>
