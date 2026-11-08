<script lang="ts">
	import { DatePicker } from '@sveltier/ui';

	// An ISO date, 'YYYY-MM-DD', or null: no time zone moves it across midnight.
	let day = $state<string | null>(null);
</script>

<!-- Typed in the reader's order (10/26/2026 here, 26/10/2026 in en-GB), or chosen in the calendar. -->
<DatePicker label="Trade date" name="day" required bind:value={day} />
