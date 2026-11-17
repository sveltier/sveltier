<script lang="ts" generics="T extends string | number">
	// One choice among a few, as a radio group. See SegmentedControlProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import Tooltip from '../Tooltip/Tooltip.svelte';
	import type { TriggerAttributes } from '../../core/overlay/types.js';
	import { rovingFocus } from '../../primitives/focus/roving-focus.js';
	import './segmented-control.css';
	import type {
		SegmentedControlDefaults,
		SegmentedControlOption,
		SegmentedControlProps
	} from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		options,
		value = $bindable(),
		onchange,
		activation = 'automatic',
		disabled = false,
		wrap = false,
		class: className,
		ref = $bindable(null),
		...rest
	}: SegmentedControlProps<T> = $props();

	const resolve = useDefaults<SegmentedControlDefaults>('SegmentedControl', {
		variant: 'elevated',
		color: 'neutral',
		size: 'md',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ variant, color, size, density, rounded }));
	const index = $derived(options.findIndex((option) => option.value === value));

	// Selection follows focus, as in a radio group: arrows move and pick, unless activation is
	// manual, when Enter or Space (a click) picks.
	function pick(option: SegmentedControlOption<T>) {
		if (disabled || option.disabled || option.value === value) return;
		value = option.value;
		onchange?.(option.value);
	}
</script>

{#snippet radio(option: SegmentedControlOption<T>, hint?: TriggerAttributes)}
	<button
		{...option.attributes}
		{...hint}
		aria-describedby={[hint?.['aria-describedby'], option.attributes?.['aria-describedby']]
			.filter(Boolean)
			.join(' ') || undefined}
		type="button"
		role="radio"
		class={['sv-segmented__option', option.attributes?.class]}
		data-sv-item
		aria-checked={option.value === value}
		disabled={disabled || option.disabled}
		onclick={() => pick(option)}
		onfocus={() => activation === 'automatic' && pick(option)}
	>
		{option.label}
	</button>
{/snippet}

<div
	bind:this={ref}
	{...rest}
	role="radiogroup"
	class={[
		'sv-segmented',
		sharedClasses(p, 'SegmentedControl'),
		wrap && 'sv-segmented--wrap',
		className
	]}
	style:--sv-segments={options.length}
	style:--sv-segment={index}
	{@attach rovingFocus({ orientation: wrap ? 'both' : 'horizontal' })}
>
	{#if index >= 0 && !wrap}<span class="sv-segmented__thumb" aria-hidden="true"></span>{/if}
	{#each options as option (option.value)}
		{#if option.tooltip}
			<Tooltip text={option.tooltip}>
				{#snippet trigger(hint)}{@render radio(option, hint)}{/snippet}
			</Tooltip>
		{:else}
			{@render radio(option)}
		{/if}
	{/each}
</div>
