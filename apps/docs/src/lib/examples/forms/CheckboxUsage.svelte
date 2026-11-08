<script>
	import { Checkbox } from '@sveltier/ui';
	let receipt = $state(true);
	let accepted = $state(false);
</script>

<Checkbox
	label="Email me a receipt"
	name="receipt"
	hint="Sent after every transfer"
	bind:checked={receipt}
/>

<!-- A label with a link in it is a snippet. -->
<Checkbox name="licence" required bind:checked={accepted}>
	{#snippet label()}
		I accept the <a href="/licence">licence terms</a>
	{/snippet}
</Checkbox>
