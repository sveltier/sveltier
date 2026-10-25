<script lang="ts">
	// A change, signed and in the up or down colour. See DeltaProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import Amount from '../Amount/Amount.svelte';
	import type { AmountDefaults } from '../Amount/types.js';
	import './delta.css';
	import type { DeltaDefaults, DeltaProps } from './types.js';

	let {
		arrow,
		value,
		format,
		decimals,
		flash = false,
		masked,
		class: className,
		ref = $bindable(null),
		...rest
	}: DeltaProps = $props();

	const resolve = useDefaults<DeltaDefaults>('Delta', { arrow: false });
	const p = $derived(resolve({ arrow }));
	// Masking is Amount's setting, so one switch hides every figure, changes among them.
	const amount = useDefaults<AmountDefaults>('Amount', { dimFraction: false, masked: false });
	const hidden = $derived(amount({ masked }).masked);

	// A masked change shows no direction: its colour and arrow would give it away.
	const direction = $derived(
		hidden || value == null || value == 0 ? 'flat' : value > 0 ? 'up' : 'down'
	);
</script>

<!-- Inline, so no whitespace between the arrow and the figure. -->
<span bind:this={ref} {...rest} class={['sv-delta', `sv-delta--${direction}`, className]}
	>{#if p.arrow && direction !== 'flat'}<svg
			class="sv-delta__arrow"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"><path d="M12 5l8 12H4z" /></svg
		>{/if}<Amount
		{value}
		format={{ signDisplay: 'exceptZero', ...format }}
		{decimals}
		{flash}
		masked={hidden}
		dimFraction={false}
	/></span
>
