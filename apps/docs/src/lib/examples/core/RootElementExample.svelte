<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ElementProps } from '@sveltier/ui';

	// Own props first; every other <span> attribute passes through.
	export type DeltaProps = ElementProps<
		HTMLSpanElement,
		HTMLAttributes<HTMLSpanElement>,
		{ value: number }
	>;
</script>

<script lang="ts">
	import { useLocale } from '@sveltier/ui';

	let { value, class: className, ref = $bindable(null), ...rest }: DeltaProps = $props();
	const locale = useLocale();
</script>

<!-- The spread comes first, so the attributes the component controls come after and win. -->
<span
	bind:this={ref}
	{...rest}
	class={['delta', value < 0 ? 'delta--down' : 'delta--up', className]}
>
	{locale.formatPercent(value, { minimumFractionDigits: 2, signDisplay: 'exceptZero' })}
</span>
