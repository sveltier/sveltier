<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TreeDemo from '#lib/docs/tree/TreeDemo.svelte';
	import { treeRows, treeUsage } from '#lib/snippets/components.js';
	import TREE_ITEM from 'virtual:sveltier-api/TreeItem';
	import TREE_PROPS from 'virtual:sveltier-api/TreeProps';
</script>

<DocPage
	title="Tree"
	lede="Nested nodes to browse and select one of, such as watchlists in folders, accounts under a client, or the pages of a guide."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the top-level nodes as <code>items</code>; a node with <code>children</code> opens and
		closes. Every node has a <code>value</code>, unique across the tree. Bind <code>value</code>
		to the selected node's value (<code>null</code> for none) and <code>expanded</code> to the
		values of the open parents. A node's <code>icon</code> is an SVG path on a 24-unit grid or an
		icon component of any set. Name the tree with <code>aria-label</code> or
		<code>aria-labelledby</code>.
	</p>
	<TreeDemo />
	<Code title="Watchlists.svelte" code={treeUsage} />

	<h2 id="rows">Rows of your own</h2>
	<p>
		Nodes can carry fields of their own: <code>onselect</code> and the <code>item</code> snippet receive
		them typed. The snippet renders the row in place of its icon and label; the chevron and the indent
		stay. Keep it to text and figures: the whole row is one node to the keyboard, so a button inside it
		is not reached.
	</p>
	<Code title="Accounts.svelte" code={treeRows} />

	<h2 id="selection">Selecting and opening</h2>
	<ul>
		<li>
			Moving through the tree does not select. A click on a row, <kbd>Enter</kbd> or
			<kbd>Space</kbd> selects the node and calls <code>onselect</code>, so a tree that navigates
			loads a page only when asked.
		</li>
		<li>
			A click on a parent's chevron opens or closes it without selecting. Closing a parent that
			holds the focus moves the focus to the parent.
		</li>
		<li>
			A <code>disabled</code> node takes focus and opens, so what is under it stays reachable, but it
			is not selected.
		</li>
		<li>
			A node with <code>children: []</code> is a parent with nothing in it yet, shown with a
			chevron; leave <code>children</code> out for a leaf.
		</li>
	</ul>

	<h2 id="keyboard">Keyboard</h2>
	<ul>
		<li>The tree is one tab stop: the node focused last, else the selected one, else the first.</li>
		<li>
			<kbd>Down</kbd> and <kbd>Up</kbd> move through the shown nodes; <kbd>Home</kbd> and
			<kbd>End</kbd> jump to the ends.
		</li>
		<li>
			<kbd>Right</kbd> opens a parent, then moves to its first child; <kbd>Left</kbd> closes it, or moves
			to the parent. They swap in right-to-left text.
		</li>
		<li>
			<kbd>*</kbd> opens every parent beside the focused node, and typing letters moves to the next node
			that starts with them.
		</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A <code>tree</code> of <code>treeitem</code>s, as the
			<a href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/">APG tree view</a> describes, with each
			node's level, place among its siblings, and whether it is open and selected.
		</li>
		<li>The children of a closed parent are not rendered.</li>
		<li>
			For a few links in a sidebar, a <a href={resolve('components/list')}>List</a> is simpler: a tree
			is for hierarchies people open and close.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Tree props" rows={TREE_PROPS} />
	<ApiTable label="TreeItem" rows={TREE_ITEM} />
</DocPage>
