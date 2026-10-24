<script lang="ts">
	// A hairline separator. See DividerProps for the props.
	import './divider.css';
	import type { DividerProps } from './types.js';

	let {
		vertical = false,
		class: className,
		ref = $bindable(null),
		...rest
	}: DividerProps = $props();
</script>

<hr
	bind:this={ref}
	{...rest}
	aria-orientation={vertical ? 'vertical' : undefined}
	class={['sv-divider', vertical && 'sv-divider--vertical', className]}
/>
