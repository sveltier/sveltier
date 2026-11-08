<script lang="ts">
	import { Select, type SelectOption } from '@sveltier/ui';

	type Market = SelectOption & { venue: string };
	let { markets }: { markets: Market[] } = $props();
	let market = $state<string | null>(null);
</script>

<!-- The option and the chosen value drawn your own way: the symbol, then its venue. -->
<Select label="Market" options={markets} bind:value={market}>
	{#snippet option(item)}
		<strong>{item.label}</strong> <small>{item.venue}</small>
	{/snippet}
	{#snippet selection(item)}
		{item.label} · {item.venue}
	{/snippet}
</Select>
