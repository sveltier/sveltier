<script>
	import { ProgressCircular, ProgressLinear } from '@sveltier/ui';

	// Percent of the file sent so far, from the upload's progress events.
	let { uploaded } = $props();
</script>

<ProgressLinear value={uploaded} label="Uploading statement" />
<ProgressCircular value={62} size="lg">62%</ProgressCircular>
<ProgressCircular indeterminate label="Loading accounts" />
