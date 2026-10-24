<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SheetDemo from '#lib/docs/sheet/SheetDemo.svelte';
	import { sheetUsage } from '#lib/snippets/overlays.js';
	import SHEET_PROPS from 'virtual:sveltier-api/SheetProps';
</script>

<DocPage
	title="Sheet"
	lede="A modal panel that slides in from an edge of the screen: a drawer from the start or the end, a sheet from the bottom or the top."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>side</code> picks the edge: <code>end</code> (the default) and <code>start</code> follow
		the writing direction, so a drawer from the end opens on the right of a left-to-right page and
		on the left of a right-to-left one. <code>size</code> sets the width; a sheet from the top or the
		bottom spans at most that width and is as tall as its content.
	</p>
	<SheetDemo />
	<Code title="Filters.svelte" code={sheetUsage} />

	<h2 id="dialog">A dialog against an edge</h2>
	<p>
		In every other way a Sheet is a <a href={resolve('overlays/dialog')}>Dialog</a>: the same
		<code>trigger</code> snippet and <code>bind:open</code>, <code>title</code> and
		<code>actions</code>, <code>persistent</code>, <code>closable</code> and the
		<code>onclose</code> reasons.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a <code>&lt;dialog&gt;</code> opened with <code>showModal()</code>: the rest of the page
			is inert and still, focus moves in and returns to the trigger.
		</li>
		<li>It slides in only when motion is allowed; with reduced motion it simply appears.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Sheet props" rows={SHEET_PROPS} />
</DocPage>
