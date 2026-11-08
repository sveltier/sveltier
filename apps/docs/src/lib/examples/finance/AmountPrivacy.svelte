<script lang="ts">
	import { Amount, DefaultsProvider, Switch } from '@sveltier/ui';

	let { balance }: { balance: number } = $props();
	let hidden = $state(false);
</script>

<Switch label="Hide amounts" bind:checked={hidden} />

<!-- One switch for the whole section: every Amount and Delta inside shows ••••. -->
<DefaultsProvider defaults={{ Amount: { masked: hidden } }}>
	<Amount value={balance} format={{ style: 'currency' }} />
</DefaultsProvider>
