<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import ContextMenuDemo from '#lib/docs/context-menu/ContextMenuDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { contextMenuUsage } from '#lib/snippets/overlays.js';
	import CONTEXT_MENU_PROPS from 'virtual:sveltier-api/ContextMenuProps';
</script>

<DocPage
	title="ContextMenu"
	lede="The actions on an element, opened where it is right-clicked: one menu for every row of a table."
>
	<h2 id="usage">Usage</h2>
	<p>
		The elements it opens on are a <code>target</code> snippet: spread the attributes it receives
		onto the element, or onto every row of a list or a table. <code>onopen</code> receives the
		element it opened on before the menu shows, so the app knows which row the actions are for, and
		can change the <code>items</code> to suit it. Right-click a row:
	</p>
	<ContextMenuDemo />
	<Code title="Orders.svelte" code={contextMenuUsage} />

	<h2 id="items">The menu</h2>
	<p>
		The menu is a <a href={resolve('overlays/menu')}>Menu</a>'s: the same <code>items</code>
		(actions, headings and separators), <code>onselect</code>, <code>onclose</code> and keys. It opens
		with its top corner at the pointer, on the other side of the pointer where it would not fit, and always
		inside the window.
	</p>

	<h2 id="keyboard">Keyboard</h2>
	<ul>
		<li>
			<kbd>Shift</kbd>+<kbd>F10</kbd> and the <kbd>ContextMenu</kbd> key open it below a target that has
			focus.
		</li>
		<li>
			In the menu, the keys are a Menu's: <kbd>↓</kbd> and <kbd>↑</kbd> move, typing moves to an
			item, <kbd>Enter</kbd> chooses, <kbd>Escape</kbd> closes and gives focus back, <kbd>Tab</kbd>
			closes and moves on.
		</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			<code>label</code> names the menu, as no button names it. The menu is <code>role="menu"</code>
			with
			<code>menuitem</code> rows.
		</li>
		<li>
			A right click is out of reach for many people: on touch screens (outside Android), with a
			keyboard on an element that takes no focus, and for anyone who does not know it is there.
			Offer the same actions another way as well, such as a Menu on each row or the row's details.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="ContextMenu props" rows={CONTEXT_MENU_PROPS} />
</DocPage>
