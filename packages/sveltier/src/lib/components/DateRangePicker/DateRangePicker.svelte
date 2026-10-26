<script lang="ts">
	// A start and an end date in one field, typed or chosen in a range calendar. See
	// DateRangePickerProps for the props.
	import { tick, untrack } from 'svelte';
	import { checkDate, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import '../../styles/visually-hidden.css';
	import Button from '../Button/Button.svelte';
	import CalendarView from '../Calendar/CalendarView.svelte';
	import { firstDayOf, parseIso, toIso, type PlainDate } from '../Calendar/dates.js';
	import { dateFormat, dateMessage, type TypedDate } from '../DatePicker/date-field.js';
	import '../DatePicker/date-picker.css';
	import Field from '../Field/Field.svelte';
	import Popover from '../Popover/Popover.svelte';
	import './date-range-picker.css';
	import type { DateRangePickerDefaults, DateRangePickerProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		start = $bindable(null),
		end = $bindable(null),
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
		'aria-label': ariaLabel,
		'aria-labelledby': labelledBy,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: DateRangePickerProps = $props();

	const resolve = useDefaults<DateRangePickerDefaults>('DateRangePicker', {
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
	const startId = $derived(id ?? uid);
	// Declared before the field, whose check can run as soon as it is created.
	const format = $derived(dateFormat(locale.locale));
	const firstDay = $derived(firstDayOfWeek ?? firstDayOf(locale.locale));
	const inert = $derived(p.disabled || readonly);

	// What each input shows, and what it means: an ISO date, null for empty (an empty string is
	// no date either), undefined for text that is not a date. A form reset goes back to the dates
	// the field started with.
	const initialStart = untrack(() => format.show(start));
	const initialEnd = untrack(() => format.show(end));
	let startText = $state(initialStart);
	let endText = $state(initialEnd);
	let typedStart = $state<TypedDate>(untrack(() => start || null));
	let typedEnd = $state<TypedDate>(untrack(() => end || null));
	let open = $state(false);
	let endInput = $state<HTMLInputElement | null>(null);

	// Dates set from outside, not typed, are written in the locale's format.
	$effect(() => {
		const next = start || null;
		if (next !== untrack(() => typedStart)) {
			typedStart = next;
			startText = format.show(next);
		}
	});
	$effect(() => {
		const next = end || null;
		if (next !== untrack(() => typedEnd)) {
			typedEnd = next;
			endText = format.show(next);
		}
	});

	// So are both dates when the locale changes.
	$effect(() => {
		const show = format.show;
		untrack(() => {
			if (typedStart) startText = show(typedStart);
			if (typedEnd) endText = show(typedEnd);
		});
	});

	// Both inputs are named after the field: its label, the app's aria-labelledby or aria-label,
	// then "Start" or "End".
	const nameFrom = $derived(label ? `${startId}-label` : labelledBy);

	const checks = $derived({ required, min, max, isDateDisabled });
	const field = createField<{ start: TypedDate; end: TypedDate }>({
		value: () => ({ start: typedStart, end: typedEnd }),
		empty: (range) => range.start === null && range.end === null,
		check: (range) =>
			dateMessage(range.start, checks, format, locale) ??
			dateMessage(range.end, checks, format, locale) ??
			(range.start && range.end && range.end < range.start ? locale.t('rangeOrder') : undefined),
		// Rules see a whole range: a half one passes them.
		rules: () =>
			rules?.map(
				(rule) => (range: { start: TypedDate; end: TypedDate }) =>
					range.start && range.end ? rule({ start: range.start, end: range.end }) : true
			),
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) {
		$effect(() => {
			// The inputs always say "Start" and "End"; the field around them needs a name of its own.
			if (!nameFrom && !ariaLabel)
				warnUnnamed('DateRangePicker', ref?.closest<HTMLElement>('.sv-field'));
			checkDate('DateRangePicker', 'start', start);
			checkDate('DateRangePicker', 'end', end);
			checkDate('DateRangePicker', 'min', min);
			checkDate('DateRangePicker', 'max', max);
		});
	}

	function commit(next: { start?: TypedDate; end?: TypedDate }) {
		if ('start' in next) typedStart = next.start;
		if ('end' in next) typedEnd = next.end;
		const changed =
			(typedStart !== undefined && typedStart !== (start || null)) ||
			(typedEnd !== undefined && typedEnd !== (end || null));
		if (typedStart !== undefined) start = typedStart;
		if (typedEnd !== undefined) end = typedEnd;
		if (changed) onchange?.({ start: start || null, end: end || null });
	}

	// Called for typing and for a form reset alike, so the dates always follow the texts.
	function read(which: 'start' | 'end', text: string) {
		if (which === 'start') startText = text;
		else endText = text;
		commit({ [which]: format.read(text) });
	}

	// Leaving a date finishes its text: a two-digit year is read now, and the date is written in
	// the locale's format. Leaving the field shows a message; going from one date to the other
	// does not leave it, going on to the calendar button does.
	function leave(event: FocusEvent) {
		const inputs: (EventTarget | null)[] = [ref, endInput];
		if (!inputs.includes(event.target)) return;
		const which = event.target === ref ? 'start' : 'end';
		commit({ [which]: format.read(which === 'start' ? startText : endText, true) });
		if (typedStart !== undefined) startText = format.show(typedStart);
		if (typedEnd !== undefined) endText = format.show(typedEnd);
		if (!inputs.includes(event.relatedTarget)) field.left();
	}

	// The first day is the start; the second, the end. A day before the start, or any day once
	// the range is whole, starts again.
	async function choose(date: PlainDate) {
		const iso = toIso(date);
		field.changed();
		if (!typedStart || typedEnd || iso < typedStart) {
			startText = format.show(iso);
			endText = '';
			commit({ start: iso, end: null });
			return;
		}
		endText = format.show(iso);
		commit({ end: iso });
		open = false;
		await tick();
		endInput?.focus();
	}
</script>

{#snippet tail()}
	{@render append?.()}
	<Popover
		bind:open
		side="bottom"
		align="end"
		aria-label={label ?? ariaLabel ?? locale.t('chooseDates')}
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
				aria-label={locale.t('chooseDates')}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
					/>
				</svg>
			</Button>
		{/snippet}
		<CalendarView
			range
			start={parseIso(typedStart)}
			end={parseIso(typedEnd)}
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
	id={startId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={tail}
	class={['sv-date-range-picker', className]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		{@const described =
			[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') || undefined}
		<span id="{startId}-start" class="sv-visually-hidden">{locale.t('rangeStart')}</span>
		<span id="{startId}-end" class="sv-visually-hidden">{locale.t('rangeEnd')}</span>
		<input
			bind:this={ref}
			defaultValue={initialStart}
			{...rest}
			{...attributes}
			aria-label={nameFrom ? undefined : `${ariaLabel ?? ''} ${locale.t('rangeStart')}`.trim()}
			aria-labelledby={nameFrom ? `${nameFrom} ${startId}-start` : undefined}
			aria-describedby={described}
			type="text"
			autocomplete="off"
			placeholder={placeholder ?? format.pattern}
			bind:value={() => startText, (text) => read('start', text)}
		/>
		<span class="sv-date-range-picker__dash" aria-hidden="true">–</span>
		<input
			bind:this={endInput}
			id="{startId}-end-input"
			class={attributes.class}
			aria-label={nameFrom ? undefined : `${ariaLabel ?? ''} ${locale.t('rangeEnd')}`.trim()}
			aria-labelledby={nameFrom ? `${nameFrom} ${startId}-end` : undefined}
			aria-describedby={described}
			aria-invalid={attributes['aria-invalid']}
			required={attributes.required}
			disabled={attributes.disabled}
			readonly={attributes.readonly}
			type="text"
			autocomplete="off"
			defaultValue={initialEnd}
			placeholder={placeholder ?? format.pattern}
			bind:value={() => endText, (text) => read('end', text)}
		/>
		{#if name}
			<input type="hidden" {name} value={start ?? ''} />
			<input type="hidden" {name} value={end ?? ''} />
		{/if}
	{/snippet}
</Field>
