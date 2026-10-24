<script lang="ts">
	// A NumberField in a themed scope and a form, with its bound value shown and the submitted
	// form data written out.
	import NumberField from '../../lib/components/NumberField/NumberField.svelte';
	import type { NumberFieldProps } from '../../lib/components/NumberField/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(null), ref = $bindable(null), ...props }: NumberFieldProps = $props();
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<NumberField label="Amount" {...props} bind:value bind:ref />
		<input aria-label="Next" />
		<button type="submit">Send</button>
	</form>
	<span data-testid="value">{value === null ? 'null' : value}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
