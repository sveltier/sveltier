<script lang="ts">
	// A RadioGroup of payout schedules in a themed form, with its bound value shown, the submitted
	// form data written out, a reset button and a field after it to move focus to.
	import RadioGroup from '../../lib/components/RadioGroup/RadioGroup.svelte';
	import type { RadioGroupProps } from '../../lib/components/RadioGroup/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(null),
		...props
	}: Omit<RadioGroupProps<number>, 'options'> & {
		options?: RadioGroupProps<number>['options'];
	} = $props();
	let submitted = $state('');

	const SCHEDULES = [
		{ value: 1, label: 'Every day' },
		{ value: 7, label: 'Every week', hint: 'Fewer, larger transfers' },
		{ value: 30, label: 'Every month', disabled: true }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<RadioGroup label="Pay out" name="payout" options={SCHEDULES} {...props} bind:value />
		<input aria-label="Next" />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="value">{value === null ? 'null' : `${typeof value}:${value}`}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
