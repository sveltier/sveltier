<script lang="ts" generics="T extends string | number">
	// One choice among a few, as a radio group. See SegmentedControlProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
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
		disabled = false,
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

	// Selection follows focus, as in a radio group: arrows move and pick.
	function pick(option: SegmentedControlOption<T>) {
		if (disabled || option.disabled || option.value === value) return;
		value = option.value;
		onchange?.(option.value);
	}
</script>

<div
	bind:this={ref}
	{...rest}
	role="radiogroup"
	class={['sv-segmented', sharedClasses(p), className]}
	style:--sv-segments={options.length}
	style:--sv-segment={index}
	{@attach rovingFocus({ orientation: 'horizontal' })}
>
	{#if index >= 0}<span class="sv-segmented__thumb" aria-hidden="true"></span>{/if}
	{#each options as option (option.value)}
		<button
			type="button"
			role="radio"
			class="sv-segmented__option"
			data-sv-item
			aria-checked={option.value === value}
			disabled={disabled || option.disabled}
			onclick={() => pick(option)}
			onfocus={() => pick(option)}
		>
			{option.label}
		</button>
	{/each}
</div>
