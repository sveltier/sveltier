<script>
	import { Stepper } from '@sveltier/ui';

	const steps = [
		{ value: 'identity', label: 'Identity', description: 'A photo of your ID' },
		{ value: 'address', label: 'Address' },
		{ value: 'review', label: 'Review' }
	];
	let step = $state('identity');
</script>

<Stepper aria-label="Verification" orientation="vertical" items={steps} bind:value={step} />
