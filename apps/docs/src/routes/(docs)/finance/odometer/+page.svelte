<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import OdometerDemo from '#lib/docs/odometer/OdometerDemo.svelte';
	import { odometerUsage } from '#lib/snippets/finance.js';
	import ODOMETER_PROPS from 'virtual:sveltier-api/OdometerProps';
</script>

<DocPage
	title="Odometer"
	lede="A headline figure whose digits roll to the new value when it changes, so the eye sees which digits moved."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the figure as <code>value</code>. It is formatted as an
		<a href={resolve('finance/amount')}>Amount</a> is, with the same <code>format</code> and
		<code>decimals</code>. When the value changes, each digit rolls to its new place; separators,
		signs and the currency stay still. It is meant for a figure on its own, such as a balance at the
		top of a screen: inside a sentence, use an Amount.
	</p>
	<OdometerDemo />
	<Code title="Balance.svelte" code={odometerUsage} />

	<h2 id="motion">Motion</h2>
	<p>
		The digits roll in the theme's slow duration and easing, with <code>transform</code> only. Under reduced
		motion they change at once. The page as the server sends it shows the figure in place, so nothing
		rolls on load.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Screen readers read the formatted figure as text; the rolling columns are hidden from them.
		</li>
		<li>
			It is not a live region: to announce a change, put it in one of your own, at a pace people can
			follow.
		</li>
		<li>It follows Amount's <code>masked</code> default, so privacy mode hides it too.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Odometer props" rows={ODOMETER_PROPS} />
</DocPage>
