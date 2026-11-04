<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TimeDemo from '#lib/docs/times/TimeDemo.svelte';
	import { timeFieldUsage } from '#lib/snippets/forms.js';
	import TIME_FIELD_PROPS from 'virtual:sveltier-api/TimeFieldProps';
</script>

<DocPage
	title="TimeField"
	lede="A time of day, typed as people write it and written back in the reader's own format."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>: <code>HH:mm</code> on the 24-hour clock, as
		<code>&lt;input type="time"&gt;</code> gives it, or <code>null</code> while the field is empty.
		An app that used the native input keeps its values. The form submits the time under
		<code>name</code>, and a reset brings back the time the field started with.
	</p>
	<TimeDemo />
	<Code title="Order.svelte" code={timeFieldUsage} />

	<h2 id="typing">Typing a time</h2>
	<p>
		The field reads hours and minutes with any separator or none (<q>9:30</q>, <q>0930</q>,
		<q>21.30</q>) and a day period, <q>am</q>, <q>p</q> or the locale's own. A time without one is
		on the 24-hour clock, so <q>9:30 pm</q> is read as 09:30 and then 21:30 as it is typed. The
		minutes are read once they have two digits, and hours alone (<q>9</q>) when the field is left.
		Leaving the field writes the time in the locale's format: <q>09:30 PM</q> in en-US,
		<q>21:30</q> in en-GB.
	</p>

	<h2 id="limits">Limits and steps</h2>
	<p>
		<code>min</code> and <code>max</code> bound the time, and <code>step</code> sets the minutes
		between the times that can be entered, counted from <code>min</code>, else from midnight, as the
		native input counts them. A time off them shows a message.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The input is a spinbutton named by its label. Its value is the minutes from midnight, and it
			is announced as the time it shows.
		</li>
		<li>
			<kbd>Arrow Up</kbd> and <kbd>Arrow Down</kbd> move by <code>step</code>, <kbd>Page Up</kbd>
			and <kbd>Page Down</kbd> by an hour, <kbd>Home</kbd> and <kbd>End</kbd> to <code>min</code>
			and <code>max</code>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="TimeField props" rows={TIME_FIELD_PROPS} />
</DocPage>
