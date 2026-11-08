<script lang="ts">
	import { Button, Stepper, type StepperItem } from '@sveltier/ui';

	const steps: StepperItem[] = [
		{ value: 'details', label: 'Details', description: 'Amount and account' },
		{ value: 'review', label: 'Review' },
		{ value: 'confirm', label: 'Confirm' }
	];
	let step = $state('details');
	const index = $derived(steps.findIndex((item) => item.value === step));
</script>

<Stepper aria-label="Transfer" items={steps} bind:value={step} />

{#if step === 'details'}
	<!-- The form of the first step -->
{/if}

<Button
	variant="text"
	disabled={index === 0}
	onclick={() => (step = steps[index - 1]?.value ?? step)}
>
	Back
</Button>
<Button
	disabled={index === steps.length - 1}
	onclick={() => (step = steps[index + 1]?.value ?? step)}
>
	Next
</Button>
