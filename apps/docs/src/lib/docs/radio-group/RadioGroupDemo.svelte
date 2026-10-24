<script lang="ts">
	// A payout schedule with hints and numbers as values, beside a statement format laid out inline.
	import { RadioGroup } from 'sveltier';

	const SCHEDULES = [
		{ value: 1, label: 'Every day' },
		{ value: 7, label: 'Every Monday', hint: 'Fewer, larger transfers' },
		{ value: 30, label: 'On the first of the month', disabled: true }
	];
	const FORMATS = [
		{ value: 'pdf', label: 'PDF' },
		{ value: 'csv', label: 'CSV' },
		{ value: 'ofx', label: 'OFX' }
	];

	let days = $state<number | null>(null);
	let format = $state<string | null>('pdf');
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<RadioGroup
			label="Pay out"
			name="payout"
			hint="Monthly payouts open once your account is verified"
			required
			options={SCHEDULES}
			bind:value={days}
		/>
		<RadioGroup
			label="Statement format"
			name="format"
			inline
			options={FORMATS}
			bind:value={format}
		/>
	</div>
	<p class="docs-dim">
		Bound values: <code>days = {JSON.stringify(days)}</code>,
		<code>format = {JSON.stringify(format)}</code>
	</p>
</div>
