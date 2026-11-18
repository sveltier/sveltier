<script lang="ts">
	import { Combobox, type SelectOption } from '@sveltier/ui';

	let { markets }: { markets: SelectOption[] } = $props();
	let market = $state<string | null>(null);
</script>

<!-- Hundreds of markets: the list opens up to 60% of the window's height. -->
<Combobox label="Market" options={markets} bind:value={market} listHeight="60dvh" />
