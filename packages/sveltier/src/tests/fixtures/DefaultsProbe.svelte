<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Density, Size, Variant } from '../../lib/core/props/types.js';

	export interface DefaultsProbeProps extends HTMLAttributes<HTMLDivElement> {
		size?: Size;
		variant?: Variant;
		density?: Density;
		value?: string;
		ref?: HTMLDivElement | null;
	}
</script>

<script lang="ts">
	// Mirrors the pattern every component follows: defaultable props destructured without a
	// fallback and resolved in $derived; bindables, class, ref and rest destructured as usual.
	import { useDefaults } from '../../lib/core/defaults/context.js';

	let {
		size,
		variant,
		density,
		value = $bindable('initial'),
		ref = $bindable(null),
		class: className,
		...rest
	}: DefaultsProbeProps = $props();

	const resolve = useDefaults<{ size: Size; variant: Variant; density: Density }>('Probe', {
		size: 'md',
		variant: 'flat',
		density: 'default'
	});
	const p = $derived(resolve({ size, variant, density }));
</script>

<div bind:this={ref} {...rest} class={['probe', className]} data-testid="probe">
	{p.size}|{p.variant}|{p.density}|{value}
</div>
<button type="button" onclick={() => (value = 'changed')}>change</button>
