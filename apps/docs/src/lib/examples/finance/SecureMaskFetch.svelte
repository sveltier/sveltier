<script lang="ts">
	import { SecureMask } from '@sveltier/ui';

	// The page loads only the last digits; the whole number is fetched when the user asks.
	let { last4, loadNumber }: { last4: string; loadNumber: () => Promise<string> } = $props();
	let revealed = $state(false);
	let number = $state<string>();

	$effect(() => {
		if (revealed && number === undefined) loadNumber().then((full) => (number = full));
	});
</script>

<SecureMask label="Card number" value={revealed && number ? number : last4} toggle bind:revealed />
