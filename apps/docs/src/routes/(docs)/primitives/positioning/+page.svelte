<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import AnchoredDemo from '#lib/docs/AnchoredDemo.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { ANCHORED_OPTIONS } from '#lib/docs/api.js';
	import { anchoredExample } from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Positioning"
	lede="Place a popover, menu or tooltip next to its trigger, keep it there on scroll and resize, and flip it when there is no room."
>
	<h2 id="anchored">Anchored elements</h2>
	<p>
		<code>anchored()</code> places the element on a side of its anchor, aligned along it, with a small
		gap. Start and end follow the writing direction, so the same code works in right-to-left layouts.
	</p>
	<AnchoredDemo />
	<Code title="AccountMenu.svelte" code={anchoredExample} />
	<ApiTable label="anchored options" rows={ANCHORED_OPTIONS} />

	<h2 id="how">How it works</h2>
	<p>
		Where the browser has CSS anchor positioning, the browser does all the work: the element moves
		with its anchor and flips without a line of script running. Elsewhere a small script loads on
		demand and places the element the same way, so browsers with native support never download it.
	</p>
	<p>
		Put the element in the top layer with <code>popover</code>, or position it with
		<code>position: fixed</code>: it is placed against the viewport, so no ancestor can clip it.
	</p>
</DocPage>
