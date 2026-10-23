<script lang="ts">
	// A circular progress indicator. See ProgressCircularProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './progress-circular.css';
	import type { ProgressCircularDefaults, ProgressCircularProps } from './types.js';

	let {
		color,
		size,
		value = 0,
		indeterminate = false,
		label,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ProgressCircularProps = $props();

	const resolve = useDefaults<ProgressCircularDefaults>('ProgressCircular', {
		color: 'primary',
		size: 'md'
	});
	const p = $derived(resolve({ color, size }));
	const locale = useLocale();
	const percent = $derived(Math.min(100, Math.max(0, Number(value) || 0)));

	// A circle of radius 20 in a 44 box, stroke 4: the arc is a dash of the circumference.
	const CIRCUMFERENCE = 2 * Math.PI * 20;
	// Indeterminate, a φ⁻² long arc turns.
	const arc = $derived(CIRCUMFERENCE * (indeterminate ? 0.382 : percent / 100));
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
		'sv-progress-circular',
		sharedClasses(p),
		indeterminate && 'sv-progress-circular--indeterminate',
		className
	]}
>
	<svg class="sv-progress-circular__svg" viewBox="0 0 44 44" aria-hidden="true">
		<circle class="sv-progress-circular__track" cx="22" cy="22" r="20" />
		<circle
			class="sv-progress-circular__arc"
			cx="22"
			cy="22"
			r="20"
			stroke-dasharray="{arc} {CIRCUMFERENCE}"
		/>
	</svg>
	{#if children}<span class="sv-progress-circular__content">{@render children()}</span>{/if}
</div>
