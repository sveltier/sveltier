<script lang="ts">
	// A horizontal progress bar. See ProgressLinearProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './progress-linear.css';
	import type { ProgressLinearDefaults, ProgressLinearProps } from './types.js';

	let {
		color,
		value = 0,
		indeterminate = false,
		label,
		class: className,
		ref = $bindable(null),
		...rest
	}: ProgressLinearProps = $props();

	const resolve = useDefaults<ProgressLinearDefaults>('ProgressLinear', { color: 'primary' });
	const p = $derived(resolve({ color }));
	const locale = useLocale();
	const percent = $derived(Math.min(100, Math.max(0, Number(value) || 0)));
</script>

<div
	bind:this={ref}
	{...rest}
	role="progressbar"
	aria-label={label ?? locale.t(indeterminate ? 'loading' : 'progress')}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={indeterminate ? undefined : percent}
	class={[
		'sv-progress-linear',
		sharedClasses({ color: p.color }, 'ProgressLinear'),
		indeterminate && 'sv-progress-linear--indeterminate',
		className
	]}
>
	<div
		class="sv-progress-linear__bar"
		style:transform={indeterminate ? undefined : `scaleX(${percent / 100})`}
	></div>
</div>
