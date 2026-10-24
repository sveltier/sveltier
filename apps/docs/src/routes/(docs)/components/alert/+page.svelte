<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import AlertDemo from '#lib/docs/alert/AlertDemo.svelte';
	import { alertUsage } from '#lib/snippets/components.js';
	import ALERT_PROPS from 'virtual:sveltier-api/AlertProps';
</script>

<DocPage
	title="Alert"
	lede="A message about something that happened or needs attention, with its kind, a title, actions and a way to dismiss it."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>type</code> picks the colour and the icon: <code>info</code>, <code>success</code>,
		<code>warning</code> or <code>error</code>. Alerts are tonal; any variant works. Put buttons in
		<code>actions</code>, and with <code>closable</code> the alert hides itself and sets
		<code>open</code> to false, so you can bind it and bring it back.
	</p>
	<AlertDemo />
	<Code title="Payment.svelte" code={alertUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Warnings and errors have <code>role="alert"</code>, read out as soon as they appear. Info and
			success messages have <code>role="status"</code>, read when the screen reader is free.
		</li>
		<li>
			The icon only repeats the type, so it is hidden from screen readers: say what happened in the
			text.
		</li>
		<li>The close button is named by <code>closeLabel</code>, or "Close".</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Alert props" rows={ALERT_PROPS} />
</DocPage>
