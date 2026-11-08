<script lang="ts">
	import { Timeline, type TimelineItem } from '@sveltier/ui';

	const events: TimelineItem[] = [
		{ title: 'Order placed', time: '2026-11-07T09:30:00Z', description: 'Buy 300 VNM at 61.20' },
		{ title: 'Filled', time: '2026-11-07T09:34:05Z', color: 'success' },
		{ title: 'Settles', time: '2026-11-09T09:00:00Z', pending: true }
	];
</script>

<Timeline aria-label="Order history" items={events} />
