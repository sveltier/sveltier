<script lang="ts">
	// A Receipt of a transfer and a plain Ledger, in a themed scope, with Amount's defaults set by
	// the test, and a LedgerRow outside a list for the development warning.
	import LedgerRow from '../../lib/components/Ledger/LedgerRow.svelte';
	import Ledger from '../../lib/components/Ledger/Ledger.svelte';
	import Receipt from '../../lib/components/Receipt/Receipt.svelte';
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		defaults = {},
		level,
		stray = false
	}: { defaults?: DefaultsConfig; level?: 2 | 3; stray?: boolean } = $props();

	const money = { style: 'currency' } as const;
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<DefaultsProvider {defaults}>
		<div style="inline-size: 20rem">
			<Receipt data-testid="receipt" title="Transfer sent" subtitle="Ref. TX-0042" {level}>
				<LedgerRow label="Amount" value={1000} format={money} />
				<LedgerRow label="Fee" value={2.5} format={money} />
				<LedgerRow label="Arrives">Today</LedgerRow>
				<LedgerRow data-testid="total" label="Total" value={1002.5} format={money} total />
				{#snippet footer()}<span data-testid="footer">Keep this for your records.</span>{/snippet}
			</Receipt>
			<Ledger data-testid="ledger" density="compact">
				<LedgerRow
					data-testid="row"
					label="A long label that has to wrap onto two lines in a narrow receipt"
					value={12}
				/>
			</Ledger>
			{#if stray}<LedgerRow label="Alone" value={1} />{/if}
		</div>
	</DefaultsProvider>
</ThemeProvider>
