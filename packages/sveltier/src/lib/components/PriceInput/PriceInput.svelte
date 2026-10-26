<script lang="ts">
	// A NumberField stepped by a tick, with the tick's decimals. See PriceInputProps for the props.
	import NumberField from '../NumberField/NumberField.svelte';
	import type { PriceInputProps } from './types.js';

	let {
		tick,
		min,
		format,
		value = $bindable(null),
		ref = $bindable(null),
		...rest
	}: PriceInputProps = $props();

	const places = (number: number) => (String(number).split('.')[1] ?? '').length;
	const ticks = $derived(typeof tick === 'number' ? [tick] : tick.map((band) => band.step));
	// Every price shows as many decimals as the finest tick, so a column of prices lines up.
	const decimals = $derived(Math.max(...ticks.map(places)));
</script>

<NumberField
	{...rest}
	bind:value
	bind:ref
	step={tick}
	min={min ?? Math.min(...ticks)}
	format={format ?? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
/>
