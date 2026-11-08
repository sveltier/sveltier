<script lang="ts">
	import { goto } from '$app/navigation';
	import { Tree, type TreeItem } from '@sveltier/ui';

	// Nodes carry their own fields: onselect and the item snippet receive them typed.
	type Account = TreeItem & { href: string; balance: string; children?: Account[] };
	let { accounts }: { accounts: Account[] } = $props();
</script>

<Tree aria-label="Accounts" items={accounts} onselect={(account) => goto(account.href)}>
	{#snippet item(account)}
		<span class="name">{account.label}</span>
		<span class="balance">{account.balance}</span>
	{/snippet}
</Tree>

<style>
	.name {
		flex: 1;
	}
	.balance {
		font-variant-numeric: tabular-nums;
	}
</style>
