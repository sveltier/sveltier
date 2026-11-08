<script>
	import { Chip } from '@sveltier/ui';
	let currencies = $state(['EUR', 'GBP', 'USD']);
</script>

{#each currencies as currency (currency)}
	<Chip
		closable
		closeLabel="Remove {currency}"
		onclose={() => (currencies = currencies.filter((c) => c !== currency))}
	>
		{currency}
	</Chip>
{/each}
