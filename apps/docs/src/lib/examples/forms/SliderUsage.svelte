<script>
	import { Slider } from '@sveltier/ui';
	let risk = $state(50);
	let share = $state(40);
</script>

<!-- On a labelled tick, the slider reads out the tick's label. -->
<Slider
	label="Risk"
	name="risk"
	step={50}
	ticks={[
		{ value: 0, label: 'Careful' },
		{ value: 50, label: 'Balanced' },
		{ value: 100, label: 'Bold' }
	]}
	bind:value={risk}
/>

<Slider
	label="Share in stocks"
	name="share"
	step={10}
	ticks
	format={(value) => `${value}%`}
	rules={[(value) => value <= 80 || 'Keep it at 80% or under']}
	bind:value={share}
/>
