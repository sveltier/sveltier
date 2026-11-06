<script lang="ts">
	// An order's history: placed, partly filled, filled, and its settlement still to come.
	import { Timeline, type TimelineItem } from '@sveltier/ui';

	const events: TimelineItem[] = [
		{ title: 'Order placed', time: '2026-11-07T09:30:00Z', description: 'Buy 300 VNM at 61.20' },
		{ title: 'Partly filled', time: '2026-11-07T09:31:12Z', description: '120 of 300 at 61.20' },
		{ title: 'Filled', time: '2026-11-07T09:34:05Z', color: 'success', description: '300 of 300' },
		{ title: 'Settles', time: '2026-11-09T09:00:00Z', pending: true, description: 'T+2' }
	];
</script>

<div class="docs-demo">
	<Timeline aria-label="Order history" items={events} />
</div>
