<script lang="ts">
	// A date and a time in one field: the date typed or chosen in a calendar, the time typed or
	// stepped. See DateTimeFieldProps for the props.
	import { tick, untrack } from 'svelte';
	import { checkDate, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import '../../styles/visually-hidden.css';
	import Button from '../Button/Button.svelte';
	import CalendarView from '../Calendar/CalendarView.svelte';
	import { firstDayOf, parseIso, toIso, type PlainDate } from '../Calendar/dates.js';
	import { dateFormat, type TypedDate } from '../DatePicker/date-field.js';
	import '../DatePicker/date-picker.css';
	import Field from '../Field/Field.svelte';
	import Popover from '../Popover/Popover.svelte';
	import { parseClock, stepTime, timeFormat, toClock, type TypedTime } from '../TimeField/time.js';
	import './date-time-field.css';
	import type { DateTimeFieldDefaults, DateTimeFieldProps } from './types.js';

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
		step,
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
	}: DateTimeFieldProps = $props();

	const resolve = useDefaults<DateTimeFieldDefaults>('DateTimeField', {
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
	const dateId = $derived(id ?? uid);
	// Declared before the field, whose check can run as soon as it is created.
	const dates = $derived(dateFormat(locale.locale));
	const times = $derived(timeFormat(locale.locale));
	const firstDay = $derived(firstDayOfWeek ?? firstDayOf(locale.locale));
	const inert = $derived(p.disabled || readonly);

	// A value split into its date and its time; nothing for anything else.
	const split = (whole: string | null | undefined) => {
		const [date = '', time = ''] = (whole ?? '').split('T');
		return parseIso(date) && parseClock(time) !== null
			? { date, time }
			: { date: null, time: null };
	};
	// The value in the locale's format, as a message writes min and max.
	const show = (whole: string) =>
		`${dates.show(split(whole).date)} ${times.show(split(whole).time)}`;

	// What each input shows, and what it means: an ISO date or HH:mm, null for empty, undefined
	// for text that is not one. A form reset goes back to what the field started with.
	const initialDate = untrack(() => dates.show(split(value).date));
	const initialTime = untrack(() => times.show(split(value).time));
	let dateText = $state(initialDate);
	let timeText = $state(initialTime);
	let typedDate = $state<TypedDate>(untrack(() => split(value).date));
	let typedTime = $state<TypedTime>(untrack(() => split(value).time));
	let open = $state(false);
	let timeInput = $state<HTMLInputElement | null>(null);

	// The value the two parts make: both, or none; undefined while one is missing or unreadable.
	const whole = (date: TypedDate, time: TypedTime): string | null | undefined =>
		date && time ? `${date}T${time}` : date === null && time === null ? null : undefined;

	// A value set from outside, not typed, is written in the locale's format.
	$effect(() => {
		const next = value || null;
		if (next !== untrack(() => whole(typedDate, typedTime))) {
			const parts = split(next);
			typedDate = parts.date;
			typedTime = parts.time;
			dateText = dates.show(parts.date);
			timeText = times.show(parts.time);
		}
	});

	// So are both parts when the locale changes.
	$effect(() => {
		const [showDate, showTime] = [dates.show, times.show];
		untrack(() => {
			if (typedDate) dateText = showDate(typedDate);
			if (typedTime) timeText = showTime(typedTime);
		});
	});

	const checks = $derived({ required, min, max, isDateDisabled });
	const field = createField<{ date: TypedDate; time: TypedTime }>({
		value: () => ({ date: typedDate, time: typedTime }),
		empty: (parts) => parts.date === null && parts.time === null,
		check: ({ date, time }) => {
			if (date === null && time === null) return checks.required ? locale.t('required') : undefined;
			if (date === undefined) return locale.t('badDate', { format: dates.pattern });
			if (time === undefined) return locale.t('badTime', { format: times.pattern });
			if (date === null || time === null) return locale.t('dateTimeIncomplete');
			if (checks.isDateDisabled?.(date)) return locale.t('dateUnavailable');
			const at = `${date}T${time}`;
			const lowest = split(checks.min).date ? checks.min : undefined;
			const highest = split(checks.max).date ? checks.max : undefined;
			if (lowest && at < lowest) return locale.t('tooEarly', { min: show(lowest) });
			if (highest && at > highest) return locale.t('tooLate', { max: show(highest) });
			return undefined;
		},
		// Rules see a whole value: a half one is stopped by the checks above.
		rules: () =>
			rules?.map(
				(rule) => (parts: { date: TypedDate; time: TypedTime }) =>
					parts.date && parts.time ? rule(`${parts.date}T${parts.time}`) : true
			),
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	// Both inputs are named after the field: its label, the app's aria-labelledby or aria-label,
	// then "Date" or "Time".
	const nameFrom = $derived(label ? `${dateId}-label` : labelledBy);

	if (DEV) {
		$effect(() => {
			// The inputs always say "Date" and "Time"; the field around them needs a name of its own.
			if (!nameFrom && !ariaLabel)
				warnUnnamed('DateTimeField', ref?.closest<HTMLElement>('.sv-field'));
			checkDate('DateTimeField', 'value', value, 'date-time');
			checkDate('DateTimeField', 'min', min, 'date-time');
			checkDate('DateTimeField', 'max', max, 'date-time');
		});
	}

	function commit(next: { date?: TypedDate; time?: TypedTime }) {
		if ('date' in next) typedDate = next.date;
		if ('time' in next) typedTime = next.time;
		const made = whole(typedDate, typedTime);
		if (made === undefined || made === (value || null)) return;
		value = made;
		onchange?.(made);
	}

	// Called for typing and for a form reset alike, so the value always follows the texts.
	function readDate(text: string) {
		dateText = text;
		commit({ date: dates.read(text) });
	}
	function readTime(text: string) {
		timeText = text;
		commit({ time: times.read(text) });
	}

	const minutes = $derived(parseClock(typedTime));

	function keydown(event: KeyboardEvent) {
		if (inert) return;
		const next = stepTime(event.key, minutes, { step });
		if (next === undefined) return;
		event.preventDefault();
		const clock = toClock(next);
		timeText = times.show(clock);
		commit({ time: clock });
		field.changed();
	}

	// Leaving a part finishes its text: a two-digit year, or hours alone, are read now, and it is
	// written in the locale's format. Leaving the field shows a message; going from the date to
	// the time does not leave it, going on to the calendar button does.
	function leave(event: FocusEvent) {
		const inputs: (EventTarget | null)[] = [ref, timeInput];
		if (!inputs.includes(event.target)) return;
		if (event.target === ref) commit({ date: dates.read(dateText, true) });
		else commit({ time: times.read(timeText, true) });
		if (typedDate !== undefined) dateText = dates.show(typedDate);
		if (typedTime !== undefined) timeText = times.show(typedTime);
		if (!inputs.includes(event.relatedTarget)) field.left();
	}

	// A day chosen in the calendar fills the date and hands focus on to the time.
	async function choose(date: PlainDate) {
		const iso = toIso(date);
		dateText = dates.show(iso);
		commit({ date: iso });
		field.changed();
		open = false;
		await tick();
		timeInput?.focus();
	}
</script>

{#snippet end()}
	{@render append?.()}
	<Popover
		bind:open
		side="bottom"
		align="end"
		aria-label={label ?? ariaLabel ?? locale.t('chooseDate')}
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
			selected={parseIso(typedDate)}
			min={parseIso(split(min).date)}
			max={parseIso(split(max).date)}
			{isDateDisabled}
			{firstDay}
			autofocus
			onchoose={choose}
		/>
	</Popover>
{/snippet}

<Field
	{...p}
	id={dateId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={end}
	class={['sv-date-time-field', className]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		{@const described =
			[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') || undefined}
		<span id="{dateId}-date" class="sv-visually-hidden">{locale.t('datePart')}</span>
		<span id="{dateId}-time" class="sv-visually-hidden">{locale.t('timePart')}</span>
		<input
			bind:this={ref}
			defaultValue={initialDate}
			{...rest}
			{...attributes}
			class={[attributes.class, 'sv-date-time-field__date']}
			aria-label={nameFrom ? undefined : `${ariaLabel ?? ''} ${locale.t('datePart')}`.trim()}
			aria-labelledby={nameFrom ? `${nameFrom} ${dateId}-date` : undefined}
			aria-describedby={described}
			type="text"
			autocomplete="off"
			placeholder={dates.pattern}
			bind:value={() => dateText, readDate}
		/>
		<input
			bind:this={timeInput}
			id="{dateId}-time-input"
			class={[attributes.class, 'sv-date-time-field__time']}
			aria-label={nameFrom ? undefined : `${ariaLabel ?? ''} ${locale.t('timePart')}`.trim()}
			aria-labelledby={nameFrom ? `${nameFrom} ${dateId}-time` : undefined}
			aria-describedby={described}
			aria-invalid={attributes['aria-invalid']}
			required={attributes.required}
			disabled={attributes.disabled}
			readonly={attributes.readonly}
			type="text"
			role="spinbutton"
			autocomplete="off"
			defaultValue={initialTime}
			placeholder={times.pattern}
			aria-valuenow={minutes ?? undefined}
			aria-valuemin={0}
			aria-valuemax={24 * 60 - 1}
			aria-valuetext={minutes === null ? undefined : times.show(typedTime)}
			bind:value={() => timeText, readTime}
			onkeydown={keydown}
		/>
		{#if name}<input type="hidden" {name} disabled={p.disabled} value={value ?? ''} />{/if}
	{/snippet}
</Field>
