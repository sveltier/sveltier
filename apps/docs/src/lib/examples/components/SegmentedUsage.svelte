<script>
	import { SegmentedControl } from '@sveltier/ui';
	let range = $state('1M');
</script>

<SegmentedControl
	aria-label="Chart range"
	options={[
		{ value: '1W', label: '1W' },
		{ value: '1M', label: '1M' },
		{ value: '1Y', label: '1Y' }
	]}
	bind:value={range}
/>
