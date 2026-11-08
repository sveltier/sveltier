<script>
	import { rise } from '@sveltier/ui';
	let shown = $state(false);
</script>

<button type="button" aria-expanded={shown} onclick={() => (shown = !shown)}>Receipt</button>

{#if shown}
	<!-- Or in:pop out:fade, or rise with { distance: 13 }. -->
	<div transition:rise>Transfer sent: €1,250.00</div>
{/if}
