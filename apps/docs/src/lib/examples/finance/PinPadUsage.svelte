<script lang="ts">
	import { PinPad } from '@sveltier/ui';

	let { confirmOrder }: { confirmOrder: (pin: string) => Promise<boolean> } = $props();
	let pin = $state('');
	let error = $state<string>();

	async function check(entered: string) {
		if (await confirmOrder(entered)) return;
		error = 'Wrong PIN, 2 tries left';
		pin = '';
	}
</script>

<PinPad label="Enter your trading PIN" bind:value={pin} {error} oncomplete={check} />
