<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TimelineDemo from '#lib/docs/timeline/TimelineDemo.svelte';
	import { timelineCustom, timelineUsage } from '#lib/snippets/components.js';
	import TIMELINE_ITEM from 'virtual:sveltier-api/TimelineItem';
	import TIMELINE_PROPS from 'virtual:sveltier-api/TimelineProps';
</script>

<DocPage
	title="Timeline"
	lede="What happened to something, in time: an order placed and filled, a transfer sent and settled, the sign-ins of an account."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the events as <code>items</code>, in the order they should show: newest first or oldest
		first is your call. Each has a <code>title</code>, and may have a <code>time</code>, a
		<code>description</code> and a <code>color</code> for its marker, such as
		<code>success</code> for a fill or <code>error</code> for a rejection. Name the timeline with
		<code>aria-label</code>.
	</p>
	<TimelineDemo />
	<Code title="OrderHistory.svelte" code={timelineUsage} />

	<h2 id="times">Times</h2>
	<p>
		A <code>time</code> is a Date, a timestamp in milliseconds or an ISO string. It is written in
		the locale and its time zone, as <q>Nov 7, 2026, 9:30 AM</q> by default; <code>timeFormat</code>
		takes other Intl options. <code>relative</code> writes <q>3 hours ago</q>, with the full date on
		hover. A string that is not a date, such as <q>Next business day</q>, is shown as written. See
		<a href={resolve('core/locale')}>Locale</a>.
	</p>

	<h2 id="pending">Events to come</h2>
	<p>
		<code>pending</code> marks an event that has not happened yet, such as a settlement date: its
		marker is hollow and its title muted, and screen readers hear <q>Pending</q> after it.
	</p>

	<h2 id="custom">Your own content</h2>
	<p>
		The <code>item</code> snippet renders an event's content in place of its title, time and description.
		It receives the item, with any extra fields typed.
	</p>
	<Code title="Transfers.svelte" code={timelineCustom} />

	<h2 id="timeline-or-stepper">Timeline or Stepper</h2>
	<p>
		A Timeline shows what happened, and the user only reads it. A
		<a href={resolve('components/stepper')}>Stepper</a> shows the steps of a task the user is doing, and
		where they are in it.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			An ordered list, named by <code>aria-label</code> or <code>aria-labelledby</code>. Each time
			is a <code>&lt;time&gt;</code> with its date in <code>datetime</code>.
		</li>
		<li>
			The markers are hidden from assistive technology. Their colour is never the only cue: say in
			the title what happened, and a pending event is read as pending.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Timeline props" rows={TIMELINE_PROPS} />
	<ApiTable label="TimelineItem" rows={TIMELINE_ITEM} />
</DocPage>
