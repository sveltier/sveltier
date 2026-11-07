<script lang="ts">
	// Labels and their figures, as a description list. See LedgerProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './ledger.css';
	import type { LedgerDefaults, LedgerProps } from './types.js';

	let {
		density,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: LedgerProps = $props();

	const resolve = useDefaults<LedgerDefaults>('Ledger', { density: 'default' });
	const p = $derived(resolve({ density }));
</script>

<dl bind:this={ref} {...rest} class={['sv-ledger', sharedClasses(p, 'Ledger'), className]}>
	{@render children?.()}
</dl>
