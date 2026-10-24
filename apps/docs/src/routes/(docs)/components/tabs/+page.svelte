<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TabsDemo from '#lib/docs/tabs/TabsDemo.svelte';
	import { tabsUsage } from '#lib/snippets/components.js';
	import TABS_PROPS from 'virtual:sveltier-api/TabsProps';
</script>

<DocPage
	title="Tabs"
	lede="Sections of one page behind a row of tabs, showing one panel at a time."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the tabs as <code>items</code>, bind the <code>value</code>, and render the selected tab's
		content in the <code>panel</code> snippet, which receives that item. A long row of tabs scrolls.
		<code>grow</code> shares the width equally.
	</p>
	<TabsDemo />
	<Code title="Account.svelte" code={tabsUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The tabs are a <code>tablist</code> with one stop in the tab order. <kbd>←</kbd>
			<kbd>→</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> move between tabs, skipping disabled ones.
		</li>
		<li>
			By default a tab is selected as soon as focus reaches it. With
			<code>activation="manual"</code>, <kbd>Enter</kbd> or <kbd>Space</kbd> selects it, for panels that
			take a while to show.
		</li>
		<li>
			The panel is labelled by its tab and takes focus itself, so its content is one <kbd>Tab</kbd>
			away. Name the tab list with <code>aria-label</code>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Tabs props" rows={TABS_PROPS} />
</DocPage>
