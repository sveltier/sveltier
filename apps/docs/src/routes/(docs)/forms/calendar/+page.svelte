<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import CalendarDemo from '#lib/docs/dates/CalendarDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { calendarUsage } from '#lib/snippets/forms.js';
	import CALENDAR_PROPS from 'virtual:sveltier-api/CalendarProps';
</script>

<DocPage
	title="Calendar"
	lede="A month on the page to choose a day from, with the keys of a date picker."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>, an ISO date. The calendar shows the month of that day, or of today,
		and follows a day set from outside into its month. It takes the limits of a
		<a href={resolve('forms/date-picker')}>DatePicker</a>: <code>min</code>, <code>max</code>,
		<code>isDateDisabled</code> and <code>firstDayOfWeek</code>. In a form, where a date is typed,
		use the DatePicker, which opens this calendar from its field.
	</p>
	<CalendarDemo />
	<Code title="Report.svelte" code={calendarUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The calendar is a <code>group</code>, named with <code>aria-label</code>. The month inside is
			a
			<code>grid</code> named by its heading, with one tab stop on the chosen day. The arrows move
			by a day and a week, <kbd>Home</kbd> and <kbd>End</kbd> to the ends of the week,
			<kbd>Page Up</kbd> and <kbd>Page Down</kbd> by a month, with <kbd>Shift</kbd> by a year; moving
			past the month shows the next one.
		</li>
		<li>
			Each day is a button named with its full date; the chosen day is selected, today is the
			current date, and a ruled-out day is disabled but can still be reached.
		</li>
		<li>The month buttons keep focus, and the heading announces the month they show.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Calendar props" rows={CALENDAR_PROPS} />
</DocPage>
