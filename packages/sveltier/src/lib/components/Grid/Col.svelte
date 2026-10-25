<script lang="ts">
	// A column of a Row. See ColProps.
	import { checkValue, DEV } from '#dev';
	import './grid.css';
	import { COLUMN_SPANS, type ColProps } from './types.js';

	let {
		cols,
		sm,
		md,
		lg,
		xl,
		xxl,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ColProps = $props();

	if (DEV) {
		$effect(() => {
			const spans = { cols, sm, md, lg, xl, xxl };
			for (const [prop, span] of Object.entries(spans)) {
				checkValue('Col', prop, span, COLUMN_SPANS);
			}
		});
	}
</script>

<!-- The spans are variables that the stylesheet's media queries read; unset ones fall back. -->
<div
	bind:this={ref}
	{...rest}
	class={['sv-col', className]}
	style:--sv-col-xs={cols}
	style:--sv-col-sm={sm}
	style:--sv-col-md={md}
	style:--sv-col-lg={lg}
	style:--sv-col-xl={xl}
	style:--sv-col-xxl={xxl}
>
	{@render children?.()}
</div>
