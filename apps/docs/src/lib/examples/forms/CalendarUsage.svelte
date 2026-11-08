<script lang="ts">
	import { Calendar } from '@sveltier/ui';

	let day = $state<string | null>('2026-10-26');
</script>

<!-- A month on the page, as a dashboard shows the day it reports on. -->
<Calendar aria-label="Report day" bind:value={day} />
