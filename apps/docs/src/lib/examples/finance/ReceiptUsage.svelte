<script lang="ts">
	import { Button, LedgerRow, Receipt } from '@sveltier/ui';

	const money = { style: 'currency' } as const;
</script>

<Receipt title="Transfer sent" subtitle="Ref. TX-20261107-0042" level={2}>
	<LedgerRow label="Amount" value={1000} format={money} />
	<LedgerRow label="Fee" value={2.5} format={money} />
	<LedgerRow label="Total" value={1002.5} format={money} total />
	{#snippet footer()}
		<Button size="sm" variant="text">Download PDF</Button>
	{/snippet}
</Receipt>
