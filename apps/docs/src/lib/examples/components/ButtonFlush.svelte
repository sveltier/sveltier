<script lang="ts">
	import { Button } from '@sveltier/ui';

	let { address, accounts, onopen }: { address: string; accounts: number; onopen: () => void } =
		$props();
</script>

<!-- A table cell on a phone: the address opens the wallet, its label in line with the text under it. -->
<div class="wallet">
	<Button variant="text" size="xs" density="dense" flush onclick={onopen}>{address}</Button>
	<span>{accounts} accounts</span>
</div>

<style>
	.wallet {
		display: grid;
		gap: var(--sv-space-2);
	}
</style>
