<script lang="ts">
	// A change, signed and in the up or down colour. See DeltaProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { numberFormat, useLocale } from '../../core/locale/locale.js';
	import Amount from '../Amount/Amount.svelte';
	import { figureOptions } from '../Amount/format.js';
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

	const locale = useLocale();

	// The direction of the figure as shown: one that rounds to zero, such as 0.00001 at two
	// decimals, reads as no change, so it is flat, as its sign is. A masked change shows none:
	// its colour and arrow would give it away.
	const direction = $derived.by(() => {
		if (hidden || value == null || value == 0) return 'flat';
		const options = figureOptions(format, decimals, locale.currency);
		const signs = numberFormat(locale.locale, { ...options, signDisplay: 'exceptZero' })
			.formatToParts(value)
			.map((part) => part.type);
		return signs.includes('plusSign') ? 'up' : signs.includes('minusSign') ? 'down' : 'flat';
	});
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
