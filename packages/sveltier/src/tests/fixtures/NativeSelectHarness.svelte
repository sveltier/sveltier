<script lang="ts">
	// A NativeSelect of countries in a themed form, with its bound value shown, the submitted
	// form data written out, and a reset button.
	import NativeSelect from '../../lib/components/NativeSelect/NativeSelect.svelte';
	import type { NativeSelectProps } from '../../lib/components/NativeSelect/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(null),
		...props
	}: Omit<NativeSelectProps<string>, 'options'> & {
		options?: NativeSelectProps<string>['options'];
	} = $props();
	let submitted = $state('');

	const COUNTRIES = [
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'vn', label: 'Vietnam' },
		{ value: 'jp', label: 'Japan', disabled: true }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<NativeSelect label="Country" name="country" options={COUNTRIES} {...props} bind:value />
		<input aria-label="Next" />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="value">{value === null ? 'null' : value}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
