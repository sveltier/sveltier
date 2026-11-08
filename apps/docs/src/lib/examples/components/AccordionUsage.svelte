<script>
	import { Accordion } from '@sveltier/ui';

	const answers = new Map([
		['fees', 'Transfers in euros are free. Other currencies cost 0.4% of the amount.'],
		['timing', 'Most transfers arrive the same day; some banks take up to two working days.'],
		['limits', 'You can send up to €20,000 a day.']
	]);
	let open = $state('fees');
</script>

<Accordion
	items={[
		{ value: 'fees', label: 'What does a transfer cost?' },
		{ value: 'timing', label: 'How long does a transfer take?' },
		{ value: 'limits', label: 'How much can I send?' }
	]}
	bind:value={open}
>
	{#snippet panel(item)}
		<p>{answers.get(item.value)}</p>
	{/snippet}
</Accordion>
