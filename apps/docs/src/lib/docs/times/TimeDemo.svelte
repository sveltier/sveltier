<script lang="ts">
	// The time an order goes in, within a session that runs 9:30 to 16:00 in steps of 15
	// minutes, with the value it holds.
	import { TimeField } from '@sveltier/ui';

	let at = $state<string | null>('09:30');
</script>

<div class="docs-demo docs-ticket">
	<TimeField
		label="Order at"
		hint="9:30 AM to 4:00 PM, every 15 minutes"
		min="09:30"
		max="16:00"
		step={15}
		bind:value={at}
	/>
	<p class="docs-dim">value: {at ?? 'null'}</p>
</div>
