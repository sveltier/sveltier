<script lang="ts">
	// A transfer's receipt: the amount, the fee, when it arrives, and the total ruled off.
	import { Button, LedgerRow, Receipt } from '@sveltier/ui';

	const money = { style: 'currency' } as const;
</script>

<div class="docs-demo">
	<Receipt
		class="docs-receipt"
		title="Transfer sent"
		subtitle="Ref. TX-20261107-0042 · Nov 7, 2026"
		level={3}
	>
		<LedgerRow label="To">Linh Tran · •••• 3000</LedgerRow>
		<LedgerRow label="Amount" value={1000} format={money} />
		<LedgerRow label="Fee" value={2.5} format={money} />
		<LedgerRow label="Arrives">Today</LedgerRow>
		<LedgerRow label="Total" value={1002.5} format={money} total />
		{#snippet footer()}
			<Button size="sm" variant="text">Download PDF</Button>
		{/snippet}
	</Receipt>
</div>

<style>
	:global(.docs-receipt) {
		max-inline-size: 22rem;
	}
</style>
