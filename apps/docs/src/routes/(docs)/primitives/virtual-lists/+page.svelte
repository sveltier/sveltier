<script lang="ts">
	import ActivityDemo from '#lib/docs/ActivityDemo.svelte';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import LedgerDemo from '#lib/docs/LedgerDemo.svelte';
	import { VIRTUAL_LIST_API, VIRTUAL_LIST_OPTIONS } from '#lib/docs/api.js';
	import {
		activeDescendantExample,
		measuredExample,
		virtualExample
	} from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Virtual lists"
	lede="Scroll through hundreds of thousands of rows while only the ones in view exist in the page."
>
	<h2 id="uniform">Rows of one height</h2>
	<p>
		<code>virtualList()</code> works out which items are in view from the scroll position, and where
		each one goes. Attach <code>viewport</code> to the scrolling element, give the element inside it
		the list's <code>totalSize</code>, and place each item at its <code>start</code>. When every
		item is as tall, finding them costs the same for ten rows or a million.
	</p>
	<LedgerDemo />
	<Code title="Ledger.svelte" code={virtualExample} />

	<h2 id="measured">Rows measured after layout</h2>
	<p>
		When heights depend on the content and the width, give an estimate and attach
		<code>measure</code> to each item, with <code>data-index</code>. Items are measured once laid
		out and again whenever their size changes. When an item above the scroll position changes
		height, the list moves with it, so what you are reading stays still. A <code>key</code> keeps
		measurements with their items when the list is sorted or grows at the top; it is read for every
		item when sizes change, so keep large data in <code>$state.raw</code>.
	</p>
	<ActivityDemo />
	<Code title="ActivityLog.svelte" code={measuredExample} />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		Only the rendered items exist, so tell assistive technology about the rest:
		<code>aria-setsize</code> and <code>aria-posinset</code> on list items and options,
		<code>aria-rowcount</code> and <code>aria-rowindex</code> in tables and grids.
	</p>
	<p>
		Items scrolled out of view are removed, along with any focus inside them. In a listbox or
		combobox, keep focus on the input or the listbox and point at the active option with
		<code>aria-activedescendant</code>. <code>scrollToIndex()</code> renders its target at once, so
		the reference always resolves. When nothing inside the scrolling element can take focus, give it
		<code>tabindex="0"</code>, a role and a label, so keyboard users can scroll it.
	</p>
	<Code title="CurrencyList.svelte" code={activeDescendantExample} />

	<h2 id="server">Server rendering</h2>
	<p>
		The server cannot measure the viewport, so it renders the items that fit in
		<code>ssrHeight</code>. It is 0 by default, which renders only the overscan; set it to the
		height the list will have and the page arrives with its first rows in place.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="virtualList options" rows={VIRTUAL_LIST_OPTIONS} />
	<ApiTable label="virtual list" rows={VIRTUAL_LIST_API} />
</DocPage>
