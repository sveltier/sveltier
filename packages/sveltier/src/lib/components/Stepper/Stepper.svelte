<script lang="ts" generics="T extends string">
	// The steps of a task and where the user is. See StepperProps for the props.
	import { checkValue, DEV, warnDuplicates } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../../styles/visually-hidden.css';
	import './stepper.css';
	import {
		STEPPER_ORIENTATIONS,
		type StepperDefaults,
		type StepperItem,
		type StepperProps
	} from './types.js';

	let {
		color,
		density,
		orientation,
		items,
		value = $bindable(),
		onchange,
		linear = true,
		class: className,
		ref = $bindable(null),
		...rest
	}: StepperProps<T> = $props();

	const resolve = useDefaults<StepperDefaults>('Stepper', {
		color: 'primary',
		density: 'default',
		orientation: 'horizontal'
	});
	const p = $derived(resolve({ color, density, orientation }));
	const locale = useLocale();

	// Without a value, or with one that is not a step, the first step.
	const current = $derived(
		Math.max(
			0,
			items.findIndex((item) => item.value === value)
		)
	);

	const CHECK = 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z';

	function go(item: StepperItem<T>, index: number) {
		if (index === current) return;
		value = item.value;
		onchange?.(item.value);
	}

	if (DEV) {
		$effect(() => checkValue('Stepper', 'orientation', p.orientation, STEPPER_ORIENTATIONS));
		$effect(() =>
			warnDuplicates(
				'Stepper',
				'items',
				items.map((item) => item.value),
				'Give each step its own value.'
			)
		);
	}
</script>

{#snippet content(item: StepperItem<T>, index: number, done: boolean)}
	<span class="sv-stepper__marker" aria-hidden="true">
		{#if item.error}
			!
		{:else if done}
			<svg viewBox="0 0 24 24" fill="currentColor"><path d={CHECK} /></svg>
		{:else}
			{index + 1}
		{/if}
	</span>
	<span class="sv-stepper__text">
		<span class="sv-stepper__label">{item.label}</span>
		{#if item.description}
			<span class="sv-stepper__description">{item.description}</span>
		{/if}
		{#if item.error}
			<span class="sv-visually-hidden">({locale.t('stepError')})</span>
		{:else if done}
			<span class="sv-visually-hidden">({locale.t('stepCompleted')})</span>
		{/if}
	</span>
{/snippet}

<ol
	bind:this={ref}
	{...rest}
	class={[
		'sv-stepper',
		`sv-stepper--${p.orientation}`,
		sharedClasses({ color: p.color, density: p.density }, 'Stepper'),
		className
	]}
>
	{#each items as item, index (index)}
		{@const done = index < current}
		{@const clickable = !item.disabled && index !== current && (!linear || done)}
		<li
			class={[
				'sv-stepper__step',
				done && 'sv-stepper__step--done',
				index === current && 'sv-stepper__step--current',
				item.error && 'sv-stepper__step--error',
				item.disabled && 'sv-stepper__step--disabled'
			]}
			aria-current={index === current ? 'step' : undefined}
		>
			{#if clickable}
				<button type="button" class="sv-stepper__head" onclick={() => go(item, index)}>
					{@render content(item, index, done)}
				</button>
			{:else}
				<span class="sv-stepper__head">{@render content(item, index, done)}</span>
			{/if}
		</li>
	{/each}
</ol>
