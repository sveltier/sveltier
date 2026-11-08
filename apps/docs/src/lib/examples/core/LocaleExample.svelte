<script lang="ts">
	import { useLocale } from '@sveltier/ui';

	let { balance, change, updatedAt }: { balance: number; change: number; updatedAt: Date } =
		$props();

	const locale = useLocale();
</script>

<p>{locale.formatCurrency(balance)}</p>
<p>{locale.formatPercent(change, { minimumFractionDigits: 2, signDisplay: 'exceptZero' })}</p>
<time datetime={updatedAt.toISOString()}>{locale.formatRelative(updatedAt)}</time>
