<script lang="ts">
	// A trade's opening and closing time: the closing one can be no earlier than the opening
	// one. Weekends are ruled out, as a market closes on them.
	import { DateTimeField } from '@sveltier/ui';

	const weekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());
	let opened = $state<string | null>('2026-10-26T09:30');
	let closed = $state<string | null>(null);
</script>

<div class="docs-demo docs-ticket">
	<DateTimeField label="Opened" isDateDisabled={weekend} required bind:value={opened} />
	<DateTimeField
		label="Closed"
		hint="Optional"
		min={opened ?? undefined}
		isDateDisabled={weekend}
		bind:value={closed}
	/>
	<p class="docs-dim">opened: {opened ?? 'null'}, closed: {closed ?? 'null'}</p>
</div>
