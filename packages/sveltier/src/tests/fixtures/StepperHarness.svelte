<script lang="ts">
	// Opening an account in four steps, the third disabled when asked. Shows the current step and
	// what the user went to, with a Next button as the app's own.
	import { untrack } from 'svelte';
	import { Stepper, type StepperItem } from '../../lib/index.js';

	let {
		value,
		linear,
		error = false,
		disabled = false
	}: { value?: string; linear?: boolean; error?: boolean; disabled?: boolean } = $props();

	const items: StepperItem[] = $derived([
		{ value: 'profile', label: 'Profile', description: 'Name and address' },
		{ value: 'identity', label: 'Identity', error },
		{ value: 'funding', label: 'Funding', disabled },
		{ value: 'review', label: 'Review' }
	]);

	let step = $state(untrack(() => value));
	let went = $state('');

	function next() {
		const index = items.findIndex((item) => item.value === step);
		step = items[Math.max(0, index) + 1]?.value ?? step;
	}
</script>

<button type="button">Before</button>
<Stepper
	aria-label="Open an account"
	{items}
	{linear}
	bind:value={step}
	onchange={(value) => (went = value)}
/>
<button type="button" onclick={next}>Next</button>
<p data-testid="step">{step}</p>
<p data-testid="went">{went}</p>
