<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ToastDemo from '#lib/docs/toast/ToastDemo.svelte';
	import ToastDialogDemo from '#lib/docs/toast/ToastDialogDemo.svelte';
	import {
		toastDefaults,
		toastDismiss,
		toastProvider,
		toastUsage
	} from '#lib/snippets/overlays.js';
	import TOAST_ACTION from 'virtual:sveltier-api/ToastAction';
	import TOAST_DEFAULTS from 'virtual:sveltier-api/ToastDefaults';
	import TOAST_INSTANCE from 'virtual:sveltier-api/ToastInstance';
	import TOAST_OPTIONS from 'virtual:sveltier-api/ToastOptions';
</script>

<DocPage
	title="Toast"
	lede="A short message at the bottom of the screen about something that just happened, with a button to undo it or act on it."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>useToast()</code> returns <code>show()</code> and <code>dismiss()</code>. Call it while a
		component initialises, then show a toast whenever something happens. <code>UIProvider</code>
		shows them; there is nothing else to add to the page.
	</p>
	<ToastDemo />
	<Code title="SendPayment.svelte" code={toastUsage} />

	<h2 id="options">Options</h2>
	<ul>
		<li>
			<code>action</code> adds a button, such as Undo or Retry. The toast closes once its
			<code>onclick</code> has run.
		</li>
		<li>
			<code>color</code> is <code>neutral</code> by default, the page inverted, so it reads on any
			surface. An intent such as <code>success</code> or <code>error</code> fills it with that colour.
		</li>
		<li>
			<code>duration</code> is 6 seconds by default, not counting the time the pointer or focus is
			on the toasts. <code>0</code> keeps a toast until it is closed.
		</li>
		<li>
			At most three show at once, newest at the top; a fourth pushes the oldest out. Every toast has
			a close button.
		</li>
	</ul>
	<p>
		<code>show()</code> returns the toast's id, and <code>dismiss(id)</code> closes it early, for example
		once the work it waits for is done.
	</p>
	<Code title="ExportTransactions.svelte" code={toastDismiss} />

	<h2 id="dialogs">Inside dialogs</h2>
	<p>
		While a <a href={resolve('overlays/dialog')}>Dialog</a> or a
		<a href={resolve('overlays/sheet')}>Sheet</a> is open, the rest of the page cannot be pressed or read,
		toasts included. So toasts show inside the open dialog, where their buttons still work, and go back
		to the page as it closes, without starting their time again.
	</p>
	<ToastDialogDemo />

	<h2 id="keyboard">Keyboard</h2>
	<ul>
		<li>
			<kbd>F8</kbd> moves focus to the toasts, which wait while it is there. <kbd>Tab</kbd> moves through
			their buttons.
		</li>
		<li>
			<kbd>Escape</kbd> goes back to where focus was. Pressing a button that closes its toast moves focus
			to the toasts left, or back once none are.
		</li>
	</ul>

	<h2 id="defaults">Defaults</h2>
	<p>
		The colour, duration, density and rounding of every toast come from the Toast defaults of the
		provider; an option passed to <code>show()</code> still wins.
	</p>
	<Code title="+layout.svelte" code={toastDefaults} />

	<h2 id="provider">Without UIProvider</h2>
	<p>
		An app on <a href={resolve('api/theme-provider')}>ThemeProvider</a> alone adds a
		<code>ToastProvider</code> around its content. Without either, <code>useToast()</code> throws
		<a href={resolve('errors')}>SV4003</a>.
	</p>
	<Code title="+layout.svelte" code={toastProvider} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The toasts sit in a region named <q>Notifications (F8)</q>, in the top layer. Screen readers
			read each toast once as it appears: errors at once, the others when the reader pauses.
		</li>
		<li>
			A toast leaves on its own, so its time waits while the pointer or focus is on the toasts, and
			<kbd>F8</kbd> reaches its button before it goes. Say what happened in the message itself; the colour
			only adds to it.
		</li>
		<li>
			For something the user must read or answer before going on, use an <a
				href={resolve('components/alert')}>Alert</a
			>
			in the page or a <a href={resolve('overlays/dialog')}>Dialog</a>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="useToast()" rows={TOAST_INSTANCE} />
	<ApiTable label="ToastOptions" rows={TOAST_OPTIONS} />
	<ApiTable label="ToastAction" rows={TOAST_ACTION} />
	<ApiTable label="Toast defaults" rows={TOAST_DEFAULTS} />
</DocPage>
