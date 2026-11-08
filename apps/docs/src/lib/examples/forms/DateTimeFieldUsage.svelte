<script lang="ts">
	import { DateTimeField } from '@sveltier/ui';

	// YYYY-MM-DDTHH:mm, local, as <input type="datetime-local"> gives it, or null.
	let opened = $state<string | null>(null);
	let closed = $state<string | null>(null);
</script>

<DateTimeField label="Opened" required name="opened" bind:value={opened} />
<!-- A trade closes after it opens: the opening time is the earliest the closing one can be. -->
<DateTimeField label="Closed" min={opened ?? undefined} name="closed" bind:value={closed} />
