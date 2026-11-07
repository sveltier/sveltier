<script lang="ts">
	// A portfolio's figures: market value, cash, the day's change and the total ruled off.
	import { Delta, Ledger, LedgerRow } from '@sveltier/ui';

	const money = { style: 'currency' } as const;
</script>

<div class="docs-demo">
	<Ledger class="docs-ledger">
		<LedgerRow label="Market value" value={18084} format={money} />
		<LedgerRow label="Cash available for trading" value={2510.4} format={money} />
		<LedgerRow label="Today"><Delta value={4183.2} format={money} /></LedgerRow>
		<LedgerRow label="Settles">Nov 9</LedgerRow>
		<LedgerRow label="Total" value={20594.4} format={money} total />
	</Ledger>
</div>

<style>
	:global(.docs-ledger) {
		max-inline-size: 22rem;
	}
</style>
