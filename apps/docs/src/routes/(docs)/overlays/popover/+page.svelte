<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import PopoverDemo from '#lib/docs/popover/PopoverDemo.svelte';
	import { popoverInfo, popoverUsage } from '#lib/snippets/overlays.js';
	import POPOVER_PROPS from 'virtual:sveltier-api/PopoverProps';
</script>

<DocPage
	title="Popover"
	lede="A panel next to the control that opens it, for a few fields, a choice or a short explanation, without blocking the page."
>
	<h2 id="usage">Usage</h2>
	<p>
		The control is a <code>trigger</code> snippet: spread the attributes it receives onto your
		Button, and it opens and closes the popover and tells assistive technology what it controls.
		<code>title</code> names the popover, <code>actions</code> receives <code>close()</code>, and
		<code>size</code> sets how wide it may grow.
	</p>
	<PopoverDemo />
	<Code title="AmountFilter.svelte" code={popoverUsage} />

	<h2 id="placement">Placement</h2>
	<p>
		<code>side</code> picks the side of the control (<code>bottom</code> by default) and
		<code>align</code> the alignment along it; <code>start</code> and <code>end</code> follow the writing
		direction. It moves to the opposite side when there is no room, and follows the control as the page
		scrolls.
	</p>
	<Code title="PendingHelp.svelte" code={popoverInfo} />

	<h2 id="closing">Closing</h2>
	<ul>
		<li>
			Escape, a press outside, and focus moving out close it; <code>onclose</code> says which, with
			<code>'escape'</code>, <code>'outside'</code>, <code>'focus'</code> or <code>'action'</code>
			(its trigger again, or <code>close()</code>).
		</li>
		<li>
			Focus may go back to the trigger without closing it, so <kbd>Shift</kbd>+<kbd>Tab</kbd> and
			<kbd>Tab</kbd> move between the control and the panel.
		</li>
		<li>
			<code>persistent</code> keeps it open until an action closes it. For a question that must be
			answered before anything else, use a <a href={resolve('overlays/dialog')}>Dialog</a>.
		</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a non-modal <code>role="dialog"</code> in the top layer. The trigger has
			<code>aria-haspopup</code>, <code>aria-expanded</code> and <code>aria-controls</code>.
		</li>
		<li>
			Focus moves to the element marked <code>autofocus</code>, else to the first one that takes
			focus, else to the panel, and returns to the trigger when it closes from inside.
		</li>
		<li>
			<code>title</code> names it; without one, give it <code>aria-label</code>. Development builds
			warn about a popover without a name.
		</li>
		<li>
			Text that only describes a control, shown on hover, is a <a href={resolve('overlays/tooltip')}
				>Tooltip</a
			>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Popover props" rows={POPOVER_PROPS} />
</DocPage>
