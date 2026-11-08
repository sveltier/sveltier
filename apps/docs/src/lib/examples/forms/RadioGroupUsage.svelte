<script>
	import { RadioGroup } from '@sveltier/ui';
	let days = $state(null);
</script>

<RadioGroup
	label="Pay out"
	name="payout"
	required
	options={[
		{ value: 1, label: 'Every day' },
		{ value: 7, label: 'Every Monday', hint: 'Fewer, larger transfers' },
		{ value: 30, label: 'On the first of the month', disabled: true }
	]}
	bind:value={days}
/>
