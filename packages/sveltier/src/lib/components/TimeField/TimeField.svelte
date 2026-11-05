<script lang="ts">
	// A time of day in a Field, typed in any common way and stepped with the keys. See
	// TimeFieldProps for the props.
	import { untrack } from 'svelte';
	import { checkDate, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import {
		DAY,
		parseClock,
		stepTime,
		timeFormat,
		timeMessage,
		toClock,
		type TypedTime
	} from './time.js';
	import type { TimeFieldDefaults, TimeFieldProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		value = $bindable(null),
		onchange,
		min,
		max,
		step,
		placeholder,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		readonly = false,
		name,
		prepend,
		append,
		id,
		'aria-describedby': describedBy,
		onkeydown,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: TimeFieldProps = $props();

	const resolve = useDefaults<TimeFieldDefaults>('TimeField', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();
	const uid = $props.id();
	// Declared before the field, whose check can run as soon as it is created.
	const format = $derived(timeFormat(locale.locale));
	const inert = $derived(p.disabled || readonly);

	// What the input shows, and what it means: HH:mm, null for empty (an empty string is no time
	// either), undefined for text that is not a time. A form reset goes back to the time the field
	// started with.
	const initial = untrack(() => format.show(value));
	let text = $state(initial);
	let typed = $state<TypedTime>(untrack(() => value || null));

	// A value set from outside, not typed, is written in the locale's format.
	$effect(() => {
		const next = value || null;
		if (next !== untrack(() => typed)) {
			typed = next;
			text = format.show(next);
		}
	});

	// So is the time when the locale changes.
	$effect(() => {
		const show = format.show;
		untrack(() => {
			if (typed) text = show(typed);
		});
	});

	const field = createField<TypedTime>({
		value: () => typed,
		empty: (time) => time === null,
		check: (time) => timeMessage(time, { required, min, max, step }, format, locale),
		// Rules never see an empty or unreadable value: the checks above stop those first.
		rules: () => rules as readonly Rule<TypedTime>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) {
		$effect(() => {
			warnUnnamed('TimeField', ref);
			checkDate('TimeField', 'value', value, 'time');
			checkDate('TimeField', 'min', min, 'time');
			checkDate('TimeField', 'max', max, 'time');
		});
	}

	const minutes = $derived(parseClock(typed));
	const lowest = $derived(parseClock(min));
	const highest = $derived(parseClock(max));

	function commit(next: TypedTime) {
		typed = next;
		if (next === undefined || next === (value || null)) return;
		value = next;
		onchange?.(next);
	}

	// Called for typing and for a form reset alike, so the value always follows the text.
	function read(next: string) {
		text = next;
		commit(format.read(next));
	}

	// Sets a time the keys chose, written at once in the locale's format.
	function set(next: number) {
		const clock = toClock(next);
		text = format.show(clock);
		commit(clock);
		field.changed();
	}

	function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		(onkeydown as ((event: KeyboardEvent) => void) | null | undefined)?.(event);
		if (event.defaultPrevented || inert) return;
		const next = stepTime(event.key, minutes, { min: lowest, max: highest, step });
		if (next === undefined) return;
		event.preventDefault();
		set(next);
	}

	// Leaving the input finishes the text: hours alone are read now, and the time is written in
	// the locale's format. Leaving means focus went outside the field, not to a button in it.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (root.contains(event.relatedTarget as Node | null)) return;
		commit(format.read(text, true));
		if (typed !== undefined) text = format.show(typed);
		field.left();
	}
</script>

<Field
	{...p}
	id={id ?? uid}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	{append}
	class={['sv-time-field', className]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<input
			bind:this={ref}
			defaultValue={initial}
			{...rest}
			{...attributes}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			type="text"
			role="spinbutton"
			inputmode="text"
			autocomplete="off"
			placeholder={placeholder ?? format.pattern}
			aria-valuenow={minutes ?? undefined}
			aria-valuemin={lowest ?? 0}
			aria-valuemax={highest ?? DAY - 1}
			aria-valuetext={minutes === null ? undefined : format.show(typed)}
			bind:value={() => text, read}
			onkeydown={keydown}
		/>
		{#if name}<input type="hidden" {name} disabled={p.disabled} value={value ?? ''} />{/if}
	{/snippet}
</Field>
