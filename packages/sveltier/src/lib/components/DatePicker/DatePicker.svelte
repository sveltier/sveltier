<script lang="ts">
	// A date typed in the locale's order, or chosen in a calendar. See DatePickerProps.
	import { tick, untrack } from 'svelte';
	import { checkDate, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Button from '../Button/Button.svelte';
	import CalendarView from '../Calendar/CalendarView.svelte';
	import { firstDayOf, parseIso, toIso, type PlainDate } from '../Calendar/dates.js';
	import Field from '../Field/Field.svelte';
	import Popover from '../Popover/Popover.svelte';
	import { dateFormat, dateMessage, type TypedDate } from './date-field.js';
	import './date-picker.css';
	import type { DatePickerDefaults, DatePickerProps } from './types.js';

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
		isDateDisabled,
		firstDayOfWeek,
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
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: DatePickerProps = $props();

	const resolve = useDefaults<DatePickerDefaults>('DatePicker', {
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
	const inputId = $derived(id ?? uid);
	// Declared before the field, whose check can run as soon as it is created.
	const format = $derived(dateFormat(locale.locale));
	const firstDay = $derived(firstDayOfWeek ?? firstDayOf(locale.locale));
	const inert = $derived(p.disabled || readonly);

	// What the input shows, and what it means: an ISO date, null for empty (an empty string is no
	// date either), undefined for text that is not a date. A form reset goes back to the date the
	// field started with.
	const initial = untrack(() => format.show(value));
	let text = $state(initial);
	let typed = $state<TypedDate>(untrack(() => value || null));
	let open = $state(false);

	// A value set from outside, not typed, is written in the locale's format.
	$effect(() => {
		const next = value || null;
		if (next !== untrack(() => typed)) {
			typed = next;
			text = format.show(next);
		}
	});

	// So is the date when the locale changes.
	$effect(() => {
		const show = format.show;
		untrack(() => {
			if (typed) text = show(typed);
		});
	});

	const field = createField<TypedDate>({
		value: () => typed,
		empty: (date) => date === null,
		check: (date) => dateMessage(date, { required, min, max, isDateDisabled }, format, locale),
		// Rules never see an empty or unreadable value: the checks above stop those first.
		rules: () => rules as readonly Rule<TypedDate>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) {
		$effect(() => {
			warnUnnamed('DatePicker', ref);
			checkDate('DatePicker', 'value', value);
			checkDate('DatePicker', 'min', min);
			checkDate('DatePicker', 'max', max);
		});
	}

	function commit(next: TypedDate) {
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

	// Leaving the input finishes the text: a two-digit year is read now, and the date is written
	// in the locale's format. It shows a message too: focus going on to the calendar button is
	// done with typing.
	function leave(event: FocusEvent) {
		if (event.target !== ref) return;
		commit(format.read(text, true));
		if (typed !== undefined) text = format.show(typed);
		field.left();
	}

	async function choose(date: PlainDate) {
		const iso = toIso(date);
		text = format.show(iso);
		commit(iso);
		field.changed();
		open = false;
		await tick();
		ref?.focus();
	}
</script>

{#snippet end()}
	{@render append?.()}
	<Popover
		bind:open
		side="bottom"
		align="end"
		aria-label={label ?? locale.t('chooseDate')}
		class="sv-date-picker__popover"
	>
		{#snippet trigger(attributes)}
			<Button
				{...attributes}
				icon
				variant="text"
				color="neutral"
				size="sm"
				disabled={inert}
				aria-label={locale.t('chooseDate')}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
					/>
				</svg>
			</Button>
		{/snippet}
		<CalendarView
			selected={parseIso(value)}
			min={parseIso(min)}
			max={parseIso(max)}
			{isDateDisabled}
			{firstDay}
			autofocus
			onchoose={choose}
		/>
	</Popover>
{/snippet}

<Field
	{...p}
	id={inputId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={end}
	class={['sv-date-picker', className]}
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
			autocomplete="off"
			placeholder={placeholder ?? format.pattern}
			bind:value={() => text, read}
		/>
		{#if name}<input type="hidden" {name} disabled={p.disabled} value={value ?? ''} />{/if}
	{/snippet}
</Field>
