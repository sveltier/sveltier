<script lang="ts">
	// A month on the page to choose one day from. See CalendarProps for the props.
	import { checkDate, DEV } from '#dev';
	import { useLocale } from '../../core/locale/locale.js';
	import CalendarView from './CalendarView.svelte';
	import { firstDayOf, parseIso, toIso, type PlainDate } from './dates.js';
	import type { CalendarProps } from './types.js';

	let {
		value = $bindable(null),
		onchange,
		min,
		max,
		isDateDisabled,
		firstDayOfWeek,
		ref = $bindable(null),
		...rest
	}: CalendarProps = $props();

	const locale = useLocale();
	const firstDay = $derived(firstDayOfWeek ?? firstDayOf(locale.locale));

	if (DEV) {
		$effect(() => {
			checkDate('Calendar', 'value', value);
			checkDate('Calendar', 'min', min);
			checkDate('Calendar', 'max', max);
		});
	}

	function choose(date: PlainDate) {
		const iso = toIso(date);
		if (iso === value) return;
		value = iso;
		onchange?.(iso);
	}
</script>

<!-- A group, so an aria-label names the month and its steps together. -->
<CalendarView
	bind:ref
	attributes={{ role: 'group', ...rest }}
	selected={parseIso(value)}
	min={parseIso(min)}
	max={parseIso(max)}
	{isDateDisabled}
	{firstDay}
	onchoose={choose}
/>
