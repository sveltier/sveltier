<script lang="ts">
	// A transfer in three steps: Next and Back are the app's own buttons, and the done steps take
	// the user back when clicked.
	import { Button, Stepper, type StepperItem } from '@sveltier/ui';

	const steps: StepperItem[] = [
		{ value: 'details', label: 'Details', description: 'Amount and account' },
		{ value: 'review', label: 'Review', description: 'Fees and arrival' },
		{ value: 'confirm', label: 'Confirm' }
	];
	let step = $state('review');
	const index = $derived(steps.findIndex((item) => item.value === step));
</script>

<div class="docs-demo">
	<Stepper aria-label="Transfer" items={steps} bind:value={step} />
	<div class="docs-demo__controls">
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
	</div>
	<p class="docs-dim">Step: <code>{JSON.stringify(step)}</code></p>
</div>
