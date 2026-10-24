<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import DividerDemo from '#lib/docs/divider/DividerDemo.svelte';
	import { dividerUsage } from '#lib/snippets/components.js';
	import DIVIDER_PROPS from 'virtual:sveltier-api/DividerProps';
</script>

<DocPage
	title="Divider"
	lede="A hairline between groups of content, across a stack or down a row, in the theme's border colour."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Divider fills the width of its container. With <code>vertical</code> it runs top to bottom and,
		in a flex row, stretches to the row's height.
	</p>
	<DividerDemo />
	<Code title="Balances.svelte" code={dividerUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		A Divider is an <code>&lt;hr&gt;</code>, which assistive technology reads as a separator, with
		<code>aria-orientation</code> when vertical. When it only decorates, add
		<code>role="presentation"</code>.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="Divider props" rows={DIVIDER_PROPS} />
</DocPage>
