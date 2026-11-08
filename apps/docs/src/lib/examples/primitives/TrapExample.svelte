<script>
	import { focusTrap } from '@sveltier/ui';
	let open = $state(false);
	let opener = $state();
</script>

<button type="button" bind:this={opener} onclick={() => (open = true)}>Transfer</button>

{#if open}
	<!-- Pass the trigger: Safari does not focus a button when it is clicked. -->
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="transfer-title"
		{@attach focusTrap({ returnFocus: opener })}
	>
		<h2 id="transfer-title">Transfer</h2>
		<input aria-label="Amount" />
		<button type="button" onclick={() => (open = false)}>Close</button>
	</div>
{/if}
