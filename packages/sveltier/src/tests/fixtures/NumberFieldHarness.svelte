<script lang="ts">
	// A NumberField in a themed scope and a form, with its bound value shown and the submitted
	// form data written out, in the locale the test gives.
	import NumberField from '../../lib/components/NumberField/NumberField.svelte';
	import type { NumberFieldProps } from '../../lib/components/NumberField/types.js';
	import LocaleProvider from '../../lib/core/locale/LocaleProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(null),
		ref = $bindable(null),
		locale = 'en-US',
		...props
	}: NumberFieldProps & { locale?: string } = $props();
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<LocaleProvider {locale}>
			<NumberField label="Amount" {...props} bind:value bind:ref />
		</LocaleProvider>
		<input aria-label="Next" />
		<button type="submit">Send</button>
	</form>
	<span data-testid="value">{value === null ? 'null' : value}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
