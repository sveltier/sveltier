<script lang="ts" module>
	export type OrderEvent = {
		title: string;
		time?: Date | number | string;
		description?: string;
		color?: 'success' | 'error';
		pending?: boolean;
		id?: string;
		venue?: string;
	};

	export const ORDER: OrderEvent[] = [
		{
			id: 'placed',
			title: 'Order placed',
			time: '2026-11-07T09:30:00Z',
			description: 'Buy 300 VNM'
		},
		{ id: 'partial', title: 'Partly filled', time: '2026-11-07T09:31:12Z', venue: 'HOSE' },
		{ id: 'filled', title: 'Filled', time: '2026-11-07T09:34:05Z', color: 'success' },
		{ id: 'settles', title: 'Settles', time: '2026-11-09T00:00:00Z', pending: true }
	];
</script>

<script lang="ts">
	// A Timeline of an order's events in a themed scope, in UTC so the times are fixed.
	import Timeline from '../../lib/components/Timeline/Timeline.svelte';
	import type { TimelineProps } from '../../lib/components/Timeline/types.js';
	import UIProvider from '../../lib/core/provider/UIProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		items = ORDER,
		custom = false,
		...props
	}: Partial<TimelineProps<OrderEvent>> & { custom?: boolean } = $props();
</script>

{#snippet venue(event: OrderEvent)}
	<b data-testid="custom">{event.title} on {event.venue ?? 'any venue'}</b>
{/snippet}

<UIProvider
	themes={monolith}
	theme="monolith-light"
	storageKey={false}
	locale={{ locale: 'en-US', timeZone: 'UTC' }}
>
	<Timeline
		data-testid="timeline"
		aria-label="Order history"
		{items}
		item={custom ? venue : undefined}
		{...props}
	/>
</UIProvider>
