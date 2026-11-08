<script>
	import { Field } from '@sveltier/ui';
	let start = $state('');
</script>

<Field label="Start date" hint="The first payment goes out on this day" required>
	{#snippet children(attributes)}
		<input type="date" name="start" {...attributes} bind:value={start} />
	{/snippet}
</Field>
