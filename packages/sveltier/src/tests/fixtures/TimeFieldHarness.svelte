<script lang="ts">
	// A time in a form that can be sent and reset, in a themed scope, with the bound value, each
	// change and the submitted form data shown, and a field after it to tab to.
	import TimeField from '../../lib/components/TimeField/TimeField.svelte';
	import type { TimeFieldProps } from '../../lib/components/TimeField/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(null), ...props }: Partial<TimeFieldProps> = $props();
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
		<TimeField
			label="Opened at"
			name="at"
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
