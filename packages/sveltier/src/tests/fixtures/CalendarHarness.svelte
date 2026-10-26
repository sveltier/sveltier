<script lang="ts">
	// A calendar in a themed scope, with the bound day and each choice shown. Weekends can be
	// ruled out, as a market closes on them.
	import Calendar from '../../lib/components/Calendar/Calendar.svelte';
	import type { CalendarProps } from '../../lib/components/Calendar/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable('2026-10-15'),
		weekends = false,
		...props
	}: Partial<CalendarProps> & { weekends?: boolean } = $props();
	let changes = $state<string[]>([]);

	const weekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Calendar
		data-testid="calendar"
		isDateDisabled={weekends ? weekend : undefined}
		onchange={(next) => changes.push(next)}
		{...props}
		bind:value
	/>
	<span data-testid="value">{value ?? 'null'}</span>
	<span data-testid="changes">{changes.join(', ')}</span>
</ThemeProvider>
