<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ListDemo from '#lib/docs/list/ListDemo.svelte';
	import { listUsage } from '#lib/snippets/components.js';
	import LIST_ITEM_PROPS from 'virtual:sveltier-api/ListItemProps';
	import LIST_PROPS from 'virtual:sveltier-api/ListProps';
</script>

<DocPage
	title="List"
	lede="Rows of text with what goes before and after them: accounts, settings, navigation."
>
	<h2 id="usage">Usage</h2>
	<p>
		A <code>List</code> holds <code>ListItem</code>s and sets their density and the colour of the
		active one. A row has a <code>title</code>, a <code>subtitle</code>, and content in
		<code>prepend</code> and <code>append</code>. With <code>href</code> the row is a link, with
		<code>onclick</code> a button, and either fills the row. <code>nav</code> rounds the rows for a sidebar.
	</p>
	<ListDemo />
	<Code title="Sidebar.svelte" code={listUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A List is a list even without bullets: it has <code>role="list"</code>, which Safari otherwise
			drops.
		</li>
		<li>
			<code>append</code> is outside the row's link or button, so a control in it is reached on its own
			and never sits inside another.
		</li>
		<li>
			An active link is marked <code>aria-current="page"</code>. Put a navigation list inside a
			<code>&lt;nav&gt;</code> with a label.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="List props" rows={LIST_PROPS} />
	<ApiTable label="ListItem props" rows={LIST_ITEM_PROPS} />
</DocPage>
