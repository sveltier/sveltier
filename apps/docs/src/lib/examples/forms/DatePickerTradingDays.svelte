<script lang="ts">
	import { DatePicker } from '@sveltier/ui';

	const HOLIDAYS = new Set(['2026-12-25', '2027-01-01']);
	// Markets close on weekends and holidays: those days can be reached, not chosen.
	const closed = (date: string) =>
		[0, 6].includes(new Date(date).getUTCDay()) || HOLIDAYS.has(date);

	let day = $state<string | null>(null);
</script>

<DatePicker
	label="Settlement date"
	min="2026-10-01"
	max="2027-03-31"
	isDateDisabled={closed}
	bind:value={day}
/>
