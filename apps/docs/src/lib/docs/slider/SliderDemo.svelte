<script lang="ts">
	// A risk level with labelled ticks read out as words, beside a percentage with a tick on every
	// step and a rule.
	import { Slider } from 'sveltier';

	const RISK = [
		{ value: 0, label: 'Careful' },
		{ value: 50, label: 'Balanced' },
		{ value: 100, label: 'Bold' }
	];

	let risk = $state(50);
	let share = $state(40);
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<Slider label="Risk" name="risk" step={50} ticks={RISK} bind:value={risk} />
		<Slider
			label="Share in stocks"
			name="share"
			step={10}
			ticks
			format={(value) => `${value}%`}
			hint="Up to 80% in this account"
			rules={[(value) => value <= 80 || 'Keep it at 80% or under']}
			bind:value={share}
		/>
	</div>
	<p class="docs-dim">
		Bound values: <code>risk = {JSON.stringify(risk)}</code>,
		<code>share = {JSON.stringify(share)}</code>
	</p>
</div>
