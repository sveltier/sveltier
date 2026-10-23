<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import LayerDemo from '#lib/docs/LayerDemo.svelte';
	import { DISMISSABLE_OPTIONS } from '#lib/docs/api.js';
	import { dismissExample } from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Layers"
	lede="Popovers, menus, sheets and dialogs close the same way: Escape, a press outside, or focus leaving, always the topmost layer first."
>
	<h2 id="dismissable">Dismissable layers</h2>
	<p>
		<code>dismissable()</code> registers an element as a layer and calls <code>onDismiss</code> with the
		reason when the user dismisses it. The component decides what to do, usually close.
	</p>
	<LayerDemo />
	<Code title="Filters.svelte" code={dismissExample} />
	<ApiTable label="dismissable options" rows={DISMISSABLE_OPTIONS} />

	<h2 id="stack">One stack</h2>
	<p>
		Every layer joins one stack, and only the topmost one reacts. A press outside a nested layer
		closes that layer alone; the next press closes the one below. An element inside that handles
		Escape itself, such as a search field clearing its text, calls
		<code>event.preventDefault()</code> and the layer stays open.
	</p>
	<p>
		Sveltier's floating components put their layer in the top layer with
		<code>popover="manual"</code> and leave dismissal to this stack, so a popover inside a sheet inside
		a dialog behaves the same at every level.
	</p>

	<h2 id="touch">Touch</h2>
	<p>
		A mouse or pen dismisses on press. A touch waits for the tap to end, so scrolling the page with
		a finger never closes a layer.
	</p>
</DocPage>
