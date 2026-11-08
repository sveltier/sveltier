<script>
	import { Accordion, Checkbox } from '@sveltier/ui';

	// With multiple, the value is the list of open sections.
	let open = $state(['payments']);
</script>

<Accordion
	multiple
	items={[
		{ value: 'payments', label: 'Payments' },
		{ value: 'security', label: 'Security' }
	]}
	bind:value={open}
>
	{#snippet panel(item)}
		<Checkbox label="Email me about {item.label.toLowerCase()}" />
	{/snippet}
</Accordion>
