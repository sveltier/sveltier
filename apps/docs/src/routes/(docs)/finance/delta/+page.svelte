<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DeltaDemo from '#lib/docs/delta/DeltaDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { deltaInTable, deltaUsage } from '#lib/snippets/finance.js';
	import DELTA_PROPS from 'virtual:sveltier-api/DeltaProps';
</script>

<DocPage
	title="Delta"
	lede="A change: a rise with a plus in the up colour, a fall with a minus in the down colour, no change muted."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the change as <code>value</code>. The figure is an
		<a href={resolve('finance/amount')}>Amount</a>, with the same <code>format</code> and
		<code>decimals</code>, and its sign always shows.
		<code>arrow</code> adds an arrow pointing up or down, and <code>flash</code> washes it in the up or
		down colour as it moves.
	</p>
	<DeltaDemo />
	<Code title="Change.svelte" code={deltaUsage} />

	<h2 id="colours">Colours</h2>
	<p>
		A rise is the theme's <code>up</code> colour and a fall its <code>down</code> colour; both pass as
		text on every surface of every theme. A theme that reads a rise as red swaps them, and every Delta
		follows.
	</p>

	<h2 id="table">In a table</h2>
	<p>
		In a <a href={resolve('components/table')}>Table</a>, render the cell with a snippet. The column
		still sorts by the number, and lines it up at the end.
	</p>
	<Code title="Watchlist.svelte" code={deltaInTable} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Colour is never the only cue: a rise reads <q>plus</q> and a fall <q>minus</q>. The arrow is
			hidden from assistive technology.
		</li>
		<li>
			A masked change shows neither its figure nor its direction: no colour, no arrow, and <q
				>Amount hidden</q
			> for screen readers.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Delta props" rows={DELTA_PROPS} />
</DocPage>
