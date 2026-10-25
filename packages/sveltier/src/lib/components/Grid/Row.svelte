<script lang="ts">
	// Twelve columns for Cols to span. See RowProps.
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { SPACES } from '../../core/props/types.js';
	import './grid.css';
	import { ROW_ALIGNS, ROW_JUSTIFIES, type RowDefaults, type RowProps } from './types.js';

	let {
		gap,
		align = 'stretch',
		justify = 'stretch',
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: RowProps = $props();

	const resolve = useDefaults<RowDefaults>('Row', { gap: 21 });
	const p = $derived(resolve({ gap }));

	if (DEV) {
		$effect(() => {
			checkValue('Row', 'gap', p.gap, SPACES);
			checkValue('Row', 'align', align, ROW_ALIGNS);
			checkValue('Row', 'justify', justify, ROW_JUSTIFIES);
		});
	}
</script>

<!-- The gap is a variable, so a class of your own can still set the row's gap. -->
<div
	bind:this={ref}
	{...rest}
	class={[
		'sv-row',
		align !== 'stretch' && `sv-row--align-${align}`,
		justify !== 'stretch' && `sv-row--justify-${justify}`,
		className
	]}
	style:--sv-row-gap={p.gap ? `var(--sv-space-${p.gap})` : '0px'}
>
	{@render children?.()}
</div>
