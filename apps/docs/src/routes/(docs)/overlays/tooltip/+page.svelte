<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TooltipDemo from '#lib/docs/tooltip/TooltipDemo.svelte';
	import { tooltipUsage, tooltipWithDialog } from '#lib/snippets/overlays.js';
	import TOOLTIP_PROPS from 'virtual:sveltier-api/TooltipProps';
</script>

<DocPage
	title="Tooltip"
	lede="A short text that describes a control: shown when the pointer rests on it and at once on keyboard focus."
>
	<h2 id="usage">Usage</h2>
	<p>
		The control is a <code>trigger</code> snippet, as with every overlay: spread the attributes it
		receives onto your Button. <code>text</code> is all a tooltip holds; for links, buttons or
		fields next to a control, use a popover. <code>side</code> and <code>align</code> place it, and it
		moves to the opposite side when there is no room.
	</p>
	<TooltipDemo />
	<Code title="Toolbar.svelte" code={tooltipUsage} />

	<h2 id="timing">When it shows</h2>
	<ul>
		<li>
			After the pointer has rested on the control for <code>delay</code> (377 ms), and at once when the
			control gets keyboard focus. A tap on a touch screen does not show it.
		</li>
		<li>
			Moving on from one tooltip to the next, as across a toolbar, shows the next one at once.
		</li>
		<li>
			It stays while the pointer moves onto it, so it can be read in full or magnified, and hides
			when the pointer leaves, when focus leaves, on <kbd>Escape</kbd> and on a press of the control.
		</li>
	</ul>

	<h2 id="dialog">On a control that opens something</h2>
	<p>
		A control can carry a tooltip and open a <a href={resolve('overlays/dialog')}>Dialog</a> or a
		<a href={resolve('overlays/sheet')}>Sheet</a>: nest the snippets and spread both sets of
		attributes onto it. The tooltip hides as the control is pressed.
	</p>
	<Code title="RenameButton.svelte" code={tooltipWithDialog} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The text is the control's description: <code>role="tooltip"</code>, linked with
			<code>aria-describedby</code>, and in the page from the start, so screen readers read it
			whether it shows or not.
		</li>
		<li>
			A description is not a name. An icon-only button still needs <code>aria-label</code>;
			development builds warn about a tooltip on a control without a name.
		</li>
		<li>
			<kbd>Escape</kbd> hides it first, before a dialog or a sheet around it, without moving focus.
		</li>
		<li>Put tooltips on controls that take focus, so keyboard users can reach them.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Tooltip props" rows={TOOLTIP_PROPS} />
</DocPage>
