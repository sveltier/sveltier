<script lang="ts">
	// A trade date and a holding period, weekends ruled out as a market closes on them, with
	// the values they hold.
	import { DatePicker, DateRangePicker } from '@sveltier/ui';

	let { range = false }: { range?: boolean } = $props();

	const weekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());
	let day = $state<string | null>('2026-10-26');
	let start = $state<string | null>('2026-10-05');
	let end = $state<string | null>('2026-10-23');
</script>

<div class="docs-demo docs-ticket">
	{#if range}
		<DateRangePicker label="Holding period" isDateDisabled={weekend} bind:start bind:end />
		<p class="docs-dim">start: {start ?? 'null'}, end: {end ?? 'null'}</p>
	{:else}
		<DatePicker label="Trade date" hint="Weekdays only" isDateDisabled={weekend} bind:value={day} />
		<p class="docs-dim">value: {day ?? 'null'}</p>
	{/if}
</div>
