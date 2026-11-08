<script>
	import { spring } from '@sveltier/ui';
	const balance = spring(248190.35, 'gentle');
</script>

<button type="button" onclick={() => (balance.target += 1000)}>Deposit 1,000</button>

<!-- target is where it is going; current is what to show. -->
<p class="amount">{balance.current.toFixed(2)}</p>
