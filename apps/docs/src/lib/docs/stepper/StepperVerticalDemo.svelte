<script lang="ts">
	// Account verification in a column, the identity step flagged: an error shows on its step
	// whether it is done or not.
	import { Stepper, type StepperItem } from '@sveltier/ui';

	const steps: StepperItem[] = [
		{ value: 'email', label: 'Email', description: 'Confirmed' },
		{ value: 'identity', label: 'Identity', description: 'The photo is blurred', error: true },
		{ value: 'address', label: 'Proof of address', description: 'A bill or bank statement' },
		{ value: 'done', label: 'Ready to trade' }
	];
	let step = $state('address');
</script>

<div class="docs-demo">
	<Stepper aria-label="Verification" orientation="vertical" items={steps} bind:value={step} />
</div>
