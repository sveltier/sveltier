<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { ElementProps } from '../../lib/core/props/element.js';
	import type { Size } from '../../lib/core/props/types.js';

	// `size` is both an <input> attribute (a number) and a shared prop; the shared prop wins.
	export type PatternFieldProps = ElementProps<
		HTMLInputElement,
		HTMLInputAttributes,
		{ size?: Size; invalid?: boolean }
	>;
</script>

<script lang="ts">
	// The root element pattern: own props destructured, `class` and `ref` handled, the rest
	// spread first so attributes the component controls come after it and win.
	let {
		size = 'md',
		invalid = false,
		class: className,
		ref = $bindable(null),
		...rest
	}: PatternFieldProps = $props();
</script>

<input
	bind:this={ref}
	{...rest}
	class={['pattern-field', `pattern-field--${size}`, className]}
	aria-invalid={invalid}
/>
