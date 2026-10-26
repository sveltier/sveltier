<script lang="ts">
	// A month on the page: the day a report covers, weekends ruled out.
	import { Calendar } from '@sveltier/ui';

	const weekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());
	let day = $state<string | null>('2026-10-26');
</script>

<div class="docs-demo">
	<Calendar aria-label="Report day" isDateDisabled={weekend} bind:value={day} />
	<p class="docs-dim">value: {day ?? 'null'}</p>
</div>
