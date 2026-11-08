<script lang="ts">
	import { TimeField } from '@sveltier/ui';

	// HH:mm on the 24-hour clock, as <input type="time"> gives it, or null.
	let opens = $state<string | null>('09:30');
</script>

<!-- Typed as 9:30, 0930 or 9:30 pm; the arrows move by 15 minutes, within the session. -->
<TimeField label="Order at" min="09:30" max="16:00" step={15} name="at" bind:value={opens} />
