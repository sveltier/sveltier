<script lang="ts">
	// The record of a payment or an order. See ReceiptProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../Ledger/ledger.css';
	import './receipt.css';
	import type { ReceiptDefaults, ReceiptProps } from './types.js';

	let {
		density,
		title,
		subtitle,
		level,
		children,
		footer,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: ReceiptProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const resolve = useDefaults<ReceiptDefaults>('Receipt', { density: 'default' });
	const p = $derived(resolve({ density }));
</script>

<section
	bind:this={ref}
	{...rest}
	{id}
	aria-labelledby="{id}-title"
	class={['sv-receipt', sharedClasses(p, 'Receipt'), className]}
>
	<header class="sv-receipt__header">
		<svelte:element this={level ? `h${level}` : 'div'} id="{id}-title" class="sv-receipt__title">
			{title}
		</svelte:element>
		{#if subtitle}<div class="sv-receipt__subtitle">{subtitle}</div>{/if}
	</header>
	<dl class="sv-ledger sv-receipt__rows">{@render children?.()}</dl>
	{#if footer}<footer class="sv-receipt__footer">{@render footer()}</footer>{/if}
</section>
