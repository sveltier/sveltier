<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DatesDemo from '#lib/docs/dates/DatesDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { datePickerTradingDays, datePickerUsage } from '#lib/snippets/forms.js';
	import DATE_PICKER_PROPS from 'virtual:sveltier-api/DatePickerProps';
</script>

<DocPage
	title="DatePicker"
	lede="A date typed in the reader's own order, or chosen in a calendar that opens from the field."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>: an ISO date, <code>YYYY-MM-DD</code>, or <code>null</code> while
		the field is empty. A date has no time of day, so no time zone can move it to the day before;
		the form submits it as it is under <code>name</code>, and a reset brings back the date the field
		started with.
	</p>
	<DatesDemo />
	<Code title="Trade.svelte" code={datePickerUsage} />

	<h2 id="typing">Typing a date</h2>
	<p>
		The field reads day, month and year in the locale's order (<q>10/26/2026</q> in en-US,
		<q>26/10/2026</q> in en-GB), with any separators or none (<q>10262026</q>), and a date that
		starts with a four-digit year, as ISO writes it. A two-digit year, in this century, is read when
		the field is left: while it is typed, <q>10/26/20</q> is on its way to 2026, so the value changes
		once. Leaving the field writes the date in the locale's format. Text that is not a date says how to
		write one, with the locale's pattern as the placeholder.
	</p>

	<h2 id="limits">Days that can be chosen</h2>
	<p>
		<code>min</code> and <code>max</code> bound the dates, and <code>isDateDisabled</code> rules days
		out, such as the weekends and holidays a market is closed. A ruled-out day can be reached in the calendar,
		so the keys never skip one silently, but it cannot be chosen, and typed, it shows a message.
	</p>
	<Code title="Settlement.svelte" code={datePickerTradingDays} />

	<h2 id="calendar">The calendar</h2>
	<p>
		The button at the end of the field opens a <a href={resolve('forms/calendar')}>Calendar</a> on
		the date, or on today; choosing a day closes it and gives focus back to the field. The week
		starts on the locale's first day; <code>firstDayOfWeek</code> sets another. For a start and an
		end, use a
		<a href={resolve('forms/date-range-picker')}>DateRangePicker</a>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The field is a text input named by its label; the button is named <q>Choose a date</q> and opens
			a dialog named after the field.
		</li>
		<li>
			In the calendar, the arrows move by a day and a week, <kbd>Home</kbd> and <kbd>End</kbd> to
			the ends of the week, <kbd>Page Up</kbd> and <kbd>Page Down</kbd> by a month, with
			<kbd>Shift</kbd> by a year; <kbd>Enter</kbd> or <kbd>Space</kbd> chooses and <kbd>Escape</kbd>
			closes.
		</li>
		<li>
			Each day is named with its full date, today is marked as the current date, and the month's
			name is announced as it changes.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="DatePicker props" rows={DATE_PICKER_PROPS} />
</DocPage>
