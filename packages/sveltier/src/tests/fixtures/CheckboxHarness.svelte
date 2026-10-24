<script lang="ts">
	// A Checkbox in a themed form, with its bound state shown, the submitted form data written
	// out, a reset button and a field after it to move focus to.
	import Checkbox from '../../lib/components/Checkbox/Checkbox.svelte';
	import type { CheckboxProps } from '../../lib/components/Checkbox/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		ref = $bindable(null),
		...props
	}: CheckboxProps = $props();
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<Checkbox
			label="Email me a receipt"
			name="receipt"
			{...props}
			bind:checked
			bind:indeterminate
			bind:ref
		/>
		<input aria-label="Next" />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="checked">{checked}</span>
	<span data-testid="indeterminate">{indeterminate}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
