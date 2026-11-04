<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import DateTimeDemo from '#lib/docs/times/DateTimeDemo.svelte';
	import { dateTimeFieldUsage } from '#lib/snippets/forms.js';
	import DATE_TIME_FIELD_PROPS from 'virtual:sveltier-api/DateTimeFieldProps';
</script>

<DocPage
	title="DateTimeField"
	lede="A date and a time of day in one field: the date typed or chosen in a calendar, the time typed or stepped."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>: <code>YYYY-MM-DDTHH:mm</code>, local and with no time zone, as
		<code>&lt;input type="datetime-local"&gt;</code> gives it, or <code>null</code> while both parts are
		empty. The value is set once both the date and the time are there. To store an instant, convert it
		to this local text and back where the app does its other time zone work.
	</p>
	<DateTimeDemo />
	<Code title="Trade.svelte" code={dateTimeFieldUsage} />

	<h2 id="parts">The date and the time</h2>
	<p>
		The date is typed and checked as in a <a href={resolve('forms/date-picker')}>DatePicker</a>, and
		its button opens a calendar; choosing a day hands focus on to the time. The time is typed and
		stepped as in a <a href={resolve('forms/time-field')}>TimeField</a>, by
		<code>step</code> minutes. One part without the other says so once the field is left; going from the
		date to the time is not leaving it.
	</p>

	<h2 id="limits">Limits</h2>
	<p>
		<code>min</code> and <code>max</code> bound the whole value, such as a closing time no earlier
		than the opening one. <code>isDateDisabled</code> and <code>firstDayOfWeek</code> apply to the date.
		A form reset brings back the value the field started with.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The two inputs are named after the field's label: <q>Opened Date</q> and
			<q>Opened Time</q>, and share its hint and message.
		</li>
		<li>The time is a spinbutton; the calendar's keys are a DatePicker's.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="DateTimeField props" rows={DATE_TIME_FIELD_PROPS} />
</DocPage>
