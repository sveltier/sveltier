<script lang="ts">
	import { Ledger, LedgerRow } from '@sveltier/ui';

	const money = { style: 'currency' } as const;
</script>

<Ledger>
	<LedgerRow label="Market value" value={18084} format={money} />
	<LedgerRow label="Cash" value={2510.4} format={money} />
	<LedgerRow label="Settles">Nov 9</LedgerRow>
	<LedgerRow label="Total" value={20594.4} format={money} total />
</Ledger>
