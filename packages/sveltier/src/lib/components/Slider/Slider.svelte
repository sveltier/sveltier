<script lang="ts">
	// A number picked along a track, with its label, its value and validation. See SliderProps.
	import { untrack } from 'svelte';
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './slider.css';
	import type { SliderDefaults, SliderProps } from './types.js';

	let {
		color,
		size,
		density,
		disabled,
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		ticks,
		format,
		label,
		hint,
		error,
		rules,
		validateOn,
		id: idProp,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: SliderProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const resolve = useDefaults<SliderDefaults>('Slider', {
		color: 'primary',
		size: 'md',
		density: 'default',
		disabled: false
	});
	const p = $derived(resolve({ color, size, density, disabled }));
	const locale = useLocale();

	const current = $derived(value ?? min);
	// A form reset goes back to the value the slider started at.
	const initial = untrack(() => value ?? min);
	// Where a value sits along the track, from 0 to 1.
	const along = (at: number) =>
		max > min ? Math.min(1, Math.max(0, (at - min) / (max - min))) : 0;

	// Steps in decimals add up with float errors (0.1 + 0.2), so tick values are rounded to the
	// decimals of min and step, the same values the input stops at.
	const decimals = (at: number) => `${at}`.split('.')[1]?.length ?? 0;
	const marks = $derived.by((): Array<{ value: number; label?: string }> => {
		if (!ticks) return [];
		if (ticks !== true) {
			return ticks.map((tick) => (typeof tick === 'number' ? { value: tick } : tick));
		}
		if (!(step > 0) || max <= min) return [];
		const places = Math.max(decimals(min), decimals(step));
		const count = Math.floor((max - min) / step + 1e-9);
		return Array.from({ length: count + 1 }, (_, index) => ({
			value: Number((min + index * step).toFixed(places))
		}));
	});

	const tickLabel = $derived(marks.find((mark) => mark.value === current && mark.label)?.label);
	const text = $derived(format?.(current) ?? tickLabel ?? locale.formatNumber(current));

	const field = createField<number>({
		value: () => current,
		// A range always holds a value; the browser keeps it between min and max, on a step.
		empty: () => false,
		check: () => undefined,
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	const message = $derived(typeof field.error === 'string' ? field.error : undefined);

	if (DEV) $effect(() => warnUnnamed('Slider', ref));

	// Letting go of the thumb, or a key step, finishes an edit, so it also counts as leaving.
	function committed() {
		field.changed();
		field.left();
	}
</script>

<div
	class={[
		'sv-slider',
		sharedClasses(p, 'Slider'),
		field.error !== false && 'sv-slider--invalid',
		p.disabled && 'sv-slider--disabled',
		className
	]}
	{style}
	style:--sv-slider-fraction={along(current)}
	oninput={field.changed}
	onchange={committed}
>
	{#if label}
		<div class="sv-slider__header">
			<label class="sv-slider__label" for={id}>{label}</label>
			<!-- Shown for sight; screen readers hear the slider's own value. -->
			<span class="sv-slider__value" aria-hidden="true">{text}</span>
		</div>
	{/if}
	<input
		bind:this={ref}
		defaultValue={initial}
		{...rest}
		{id}
		type="range"
		class="sv-slider__input"
		{min}
		{max}
		{step}
		disabled={p.disabled}
		aria-describedby={[describedBy, message ? `${id}-error` : hint ? `${id}-hint` : undefined]
			.filter(Boolean)
			.join(' ') || undefined}
		aria-invalid={field.error !== false || undefined}
		aria-valuetext={format || tickLabel ? text : undefined}
		bind:value={() => current, (next: number) => (value = next)}
	/>
	{#if marks.length}
		<div class="sv-slider__ticks" aria-hidden="true">
			{#each marks as mark (mark.value)}
				<span
					class={[
						'sv-slider__tick',
						mark.value <= min && 'sv-slider__tick--start',
						mark.value >= max && 'sv-slider__tick--end'
					]}
					style:--sv-slider-at={along(mark.value)}
					>{#if mark.label}<span class="sv-slider__tick-label">{mark.label}</span>{/if}</span
				>
			{/each}
		</div>
	{/if}
	{#if hint && !message}<p class="sv-slider__hint" id="{id}-hint">{hint}</p>{/if}
	<!-- Announces an error that appears after the user has moved on. -->
	<div aria-live="polite">
		{#if message}<p class="sv-slider__error" id="{id}-error">{message}</p>{/if}
	</div>
</div>
