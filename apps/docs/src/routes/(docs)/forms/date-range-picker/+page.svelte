<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DatesDemo from '#lib/docs/dates/DatesDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { dateRangeUsage } from '#lib/snippets/forms.js';
	import DATE_RANGE_PICKER_PROPS from 'virtual:sveltier-api/DateRangePickerProps';
</script>

<DocPage
	title="DateRangePicker"
	lede="A start and an end date in one field, each typed in the reader's order, or both chosen in one calendar."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind <code>start</code> and <code>end</code>, ISO dates or <code>null</code>.
		<code>onchange</code> receives both whenever either changes. With <code>name</code>, the form
		submits the start and then the end under that name: <code>FormData.getAll(name)</code> reads
		them. Each date is typed as in a <a href={resolve('forms/date-picker')}>DatePicker</a>.
	</p>
	<DatesDemo range />
	<Code title="Period.svelte" code={dateRangeUsage} />

	<h2 id="choosing">Choosing a range</h2>
	<p>
		In the calendar, the first day chosen is the start and the second the end, which closes it and
		gives focus to the end. Until then the days up to the one under the pointer or the focus show
		the range to be. A day before the start, or any day once the range is whole, starts it again.
	</p>

	<h2 id="validation">Checks</h2>
	<p>
		Each date is checked as a <a href={resolve('forms/date-picker')}>DatePicker</a> checks one,
		against
		<code>min</code>, <code>max</code> and <code>isDateDisabled</code>, and the end must not come
		before the start. <code>required</code> asks for both; <code>rules</code> run once both are there.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The two inputs are named after the field's label: <q>Holding period Start</q> and
			<q>Holding period End</q>, and share its hint and message. Without a label they are named
			after the field's <code>aria-labelledby</code> or <code>aria-label</code>.
		</li>
		<li>
			The calendar's keys are a DatePicker's; the button is named <q>Choose dates</q>. The grid
			allows several days, and every day of the range is selected.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="DateRangePicker props" rows={DATE_RANGE_PICKER_PROPS} />
</DocPage>
