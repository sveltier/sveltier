<script lang="ts">
	// A trading PIN: 2580 is the right one here; any other is refused and the pad cleared.
	import { PinPad } from '@sveltier/ui';

	let pin = $state('');
	let error = $state<string>();
	let unlocked = $state(false);

	function check(entered: string) {
		if (entered === '2580') {
			unlocked = true;
			error = undefined;
		} else {
			error = `Wrong PIN. Try 2580.`;
			pin = '';
		}
	}
</script>

<div class="docs-demo docs-pin-pad">
	{#if unlocked}
		<p>Order confirmed.</p>
		<button type="button" class="docs-link-button" onclick={() => ((unlocked = false), (pin = ''))}
			>Enter it again</button
		>
	{:else}
		<PinPad label="Enter your trading PIN" length={4} bind:value={pin} {error} oncomplete={check} />
	{/if}
</div>

<style>
	.docs-pin-pad {
		display: grid;
		justify-items: center;
		gap: var(--sv-space-13);
	}

	.docs-link-button {
		border: 0;
		background: none;
		color: var(--sv-color-primary);
		font: inherit;
		cursor: pointer;
	}
</style>
