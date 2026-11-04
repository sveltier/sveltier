<script lang="ts">
	// A trade date in a form that can be sent and reset, in a themed scope, with the bound value,
	// each change and the submitted form data shown, and a field after it to tab to. Weekends can
	// be ruled out.
	import DatePicker from '../../lib/components/DatePicker/DatePicker.svelte';
	import type { DatePickerProps } from '../../lib/components/DatePicker/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(null),
		weekends = false,
		...props
	}: Partial<DatePickerProps> & { weekends?: boolean } = $props();
	let changes = $state<string[]>([]);
	let submitted = $state('');

	const weekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<DatePicker
			label="Trade date"
			name="day"
			isDateDisabled={weekends ? weekend : undefined}
			onchange={(next) => changes.push(String(next))}
			{...props}
			bind:value
		/>
		<input aria-label="Next" />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="value">{value ?? 'null'}</span>
	<span data-testid="changes">{changes.join(', ')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
