<script lang="ts">
	// A label and its figure, joined by a dotted leader. See LedgerRowProps for the props.
	import { DEV, warnOutsideList } from '#dev';
	import Amount from '../Amount/Amount.svelte';
	import './ledger.css';
	import type { LedgerRowProps } from './types.js';

	let {
		label,
		value,
		format,
		decimals,
		total = false,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: LedgerRowProps = $props();

	if (DEV) {
		$effect(() => warnOutsideList('LedgerRow', ref));
	}
</script>

<div
	bind:this={ref}
	{...rest}
	class={['sv-ledger-row', total && 'sv-ledger-row--total', className]}
>
	<dt class="sv-ledger-row__label">{label}</dt>
	<dd class="sv-ledger-row__value">
		{#if children}{@render children()}{:else}<Amount {value} {format} {decimals} />{/if}
	</dd>
</div>
