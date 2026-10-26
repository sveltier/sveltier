<script lang="ts">
	// A holding period in a form that can be sent and reset, in a themed scope, with the bound
	// dates, each change and the submitted form data shown.
	import DateRangePicker from '../../lib/components/DateRangePicker/DateRangePicker.svelte';
	import type { DateRangePickerProps } from '../../lib/components/DateRangePicker/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		start = $bindable(null),
		end = $bindable(null),
		...props
	}: Partial<DateRangePickerProps> = $props();
	let changes = $state<string[]>([]);
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<DateRangePicker
			label="Holding period"
			name="period"
			onchange={(range) => changes.push(`${range.start}→${range.end}`)}
			{...props}
			bind:start
			bind:end
		/>
		<input aria-label="Next" />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="start">{start ?? 'null'}</span>
	<span data-testid="end">{end ?? 'null'}</span>
	<span data-testid="changes">{changes.join(', ')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
