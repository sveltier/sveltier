<script lang="ts">
	// A month as the APG date picker grid, shared by Calendar, DatePicker and DateRangePicker: one
	// day, or a range, chosen with the pointer or the keys. The visible month follows the day that
	// has focus.
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useLocale } from '../../core/locale/locale.js';
	import Button from '../Button/Button.svelte';
	import {
		addDays,
		addMonths,
		asUtcDate,
		compare,
		monthWeeks,
		today,
		toIso,
		weekday,
		type PlainDate
	} from './dates.js';
	import './calendar.css';

	let {
		selected = null,
		range = false,
		start = null,
		end = null,
		min = null,
		max = null,
		isDateDisabled,
		firstDay,
		autofocus = false,
		onchoose,
		class: className,
		attributes,
		ref = $bindable(null)
	}: {
		/** The chosen day, one day at a time. */
		selected?: PlainDate | null;
		/** Chooses a start and an end instead of one day. */
		range?: boolean;
		start?: PlainDate | null;
		end?: PlainDate | null;
		min?: PlainDate | null;
		max?: PlainDate | null;
		isDateDisabled?: (iso: string) => boolean;
		/** 0 Sunday to 6 Saturday. */
		firstDay: number;
		/**
		 * Marks the day with the tab stop `autofocus`, so a popover that opens with the grid moves
		 * focus to it, as the APG date picker dialog does.
		 */
		autofocus?: boolean;
		onchoose: (date: PlainDate) => void;
		class?: HTMLAttributes<HTMLDivElement>['class'];
		/** Attributes for the root element, from the component that renders the view. */
		attributes?: HTMLAttributes<HTMLDivElement>;
		ref?: HTMLDivElement | null;
	} = $props();

	const locale = useLocale();
	const uid = $props.id();
	const now = today(locale.timeZone);

	// The day with the tab stop, and so the month shown: the chosen day or the range's start, even
	// outside min and max, else today kept within them. The keys and the month buttons move it
	// until a day is chosen, here or from outside.
	const within = (date: PlainDate) =>
		min && compare(date, min) < 0 ? min : max && compare(date, max) > 0 ? max : date;
	let focused = $derived((range ? start : selected) ?? within(now));
	// While a range's end is being chosen, the day under the pointer or the focus shows it.
	let pointed = $state<PlainDate | null>(null);

	// Gregorian and Latin digits in every locale, as the grid is.
	const format = (options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat(locale.locale, {
			...options,
			timeZone: 'UTC',
			calendar: 'gregory',
			numberingSystem: 'latn'
		});
	const title = $derived(
		format({ month: 'long', year: 'numeric' }).format(asUtcDate({ ...focused, day: 1 }))
	);
	const fullDate = $derived(format({ dateStyle: 'full' }));
	const weekdays = $derived.by(() => {
		const short = format({ weekday: 'short' });
		const long = format({ weekday: 'long' });
		// 2023-01-01 was a Sunday: day i of the week is i days after it.
		return Array.from({ length: 7 }, (_, i) => {
			const date = asUtcDate({ year: 2023, month: 1, day: 1 + ((firstDay + i) % 7) });
			return { short: short.format(date), long: long.format(date) };
		});
	});
	const weeks = $derived(monthWeeks(focused.year, focused.month, firstDay));

	const same = (a: PlainDate | null, b: PlainDate | null) => !!a && !!b && compare(a, b) === 0;
	const disabled = (date: PlainDate) =>
		(min !== null && compare(date, min) < 0) ||
		(max !== null && compare(date, max) > 0) ||
		(isDateDisabled?.(toIso(date)) ?? false);

	// A range from its first day to its last, whichever order its ends come in.
	const span = (from: PlainDate, to: PlainDate | null) =>
		to && compare(to, from) < 0 ? { from: to, to: from } : { from, to: to ?? from };
	// The range as shown: its ends, or its start and the day pointed at while the end is chosen.
	const shown = $derived(range && start ? span(start, end ?? pointed) : null);
	// The range as chosen, every day of which is selected.
	const chosen = $derived(range && start ? span(start, end) : null);
	const between = (date: PlainDate, of: { from: PlainDate; to: PlainDate } | null) =>
		!!of && compare(date, of.from) >= 0 && compare(date, of.to) <= 0;
	// The chosen day, or the ends of the range, are filled.
	const isEnd = (date: PlainDate) =>
		range ? same(date, start) || same(date, end) : same(date, selected);

	let grid = $state<HTMLTableElement | null>(null);

	async function moveTo(date: PlainDate) {
		focused = date;
		if (range && start && !end) pointed = date;
		await tick();
		grid?.querySelector<HTMLElement>(`[data-date="${toIso(date)}"]`)?.focus();
	}

	function keydown(event: KeyboardEvent) {
		if (!(event.target as HTMLElement).dataset.date) return;
		// Alt, Control and Command with these keys belong to the browser: back, switching tabs.
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		const rtl = grid ? getComputedStyle(grid).direction === 'rtl' : false;
		const intoWeek = (weekday(focused) - firstDay + 7) % 7;
		const moves: Record<string, (() => PlainDate) | undefined> = {
			ArrowLeft: () => addDays(focused, rtl ? 1 : -1),
			ArrowRight: () => addDays(focused, rtl ? -1 : 1),
			ArrowUp: () => addDays(focused, -7),
			ArrowDown: () => addDays(focused, 7),
			Home: () => addDays(focused, -intoWeek),
			End: () => addDays(focused, 6 - intoWeek),
			PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
			PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1)
		};
		const move = moves[event.key];
		if (!move) return;
		event.preventDefault();
		void moveTo(move());
	}

	function choose(date: PlainDate) {
		if (disabled(date)) return;
		focused = date;
		pointed = null;
		onchoose(date);
	}

	// The tab stop follows focus, also to a day that cannot be chosen.
	function enter(date: PlainDate) {
		if (!same(date, focused)) focused = date;
	}
</script>

<div bind:this={ref} {...attributes} class={['sv-calendar', attributes?.class, className]}>
	<div class="sv-calendar__header">
		<Button
			icon
			variant="text"
			color="neutral"
			size="sm"
			aria-label={locale.t('previousMonth')}
			class="sv-calendar__step"
			onclick={() => (focused = addMonths(focused, -1))}
		>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z" />
			</svg>
		</Button>
		<div class="sv-calendar__title" id="{uid}-title" aria-live="polite">{title}</div>
		<Button
			icon
			variant="text"
			color="neutral"
			size="sm"
			aria-label={locale.t('nextMonth')}
			class="sv-calendar__step"
			onclick={() => (focused = addMonths(focused, 1))}
		>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6z" />
			</svg>
		</Button>
	</div>
	<table
		bind:this={grid}
		role="grid"
		aria-labelledby="{uid}-title"
		aria-multiselectable={range || undefined}
		class="sv-calendar__grid"
		onkeydown={keydown}
		onpointerleave={() => (pointed = null)}
	>
		<thead>
			<tr>
				{#each weekdays as name, i (i)}
					<th scope="col" abbr={name.long} class="sv-calendar__weekday">{name.short}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week, w (w)}
				<tr>
					{#each week as date, i (i)}
						{#if date}
							{@const off = disabled(date)}
							<td
								role="gridcell"
								aria-selected={range ? between(date, chosen) : same(date, selected)}
								class={[
									'sv-calendar__cell',
									isEnd(date) && 'sv-calendar__cell--chosen',
									between(date, shown) && 'sv-calendar__cell--within',
									shown && same(date, shown.from) && 'sv-calendar__cell--from',
									shown && same(date, shown.to) && 'sv-calendar__cell--to'
								]}
							>
								<!-- svelte-ignore a11y_autofocus -->
								<button
									type="button"
									class="sv-calendar__day"
									autofocus={autofocus && same(date, focused)}
									data-date={toIso(date)}
									tabindex={same(date, focused) ? 0 : -1}
									aria-label={fullDate.format(asUtcDate(date))}
									aria-current={same(date, now) ? 'date' : undefined}
									aria-disabled={off || undefined}
									onclick={() => choose(date)}
									onfocus={() => enter(date)}
									onpointerenter={() => (pointed = date)}
								>
									{date.day}
								</button>
							</td>
						{:else}
							<td role="gridcell" class="sv-calendar__cell sv-calendar__cell--blank"></td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
