<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import MenuDemo from '#lib/docs/menu/MenuDemo.svelte';
	import { menuIconButton, menuUsage } from '#lib/snippets/overlays.js';
	import MENU_ACTION from 'virtual:sveltier-api/MenuAction';
	import MENU_PROPS from 'virtual:sveltier-api/MenuProps';
</script>

<DocPage
	title="Menu"
	lede="A list of actions that opens from a button, driven by data and by the keyboard as the platform's own menus are."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>items</code> lists the entries in order and <code>onselect</code> receives the one the
		user chooses, after the menu has closed and given focus back to its button. The button is a
		<code>trigger</code> snippet: spread the attributes it receives onto it.
	</p>
	<MenuDemo />
	<Code title="AccountActions.svelte" code={menuUsage} />

	<h2 id="items">Entries</h2>
	<ul>
		<li>
			An action has a <code>label</code>, and may have a <code>value</code>, an <code>icon</code>
			(an SVG path on a 24-unit grid, as icon sets such as Material Design Icons export), a
			<code>shortcut</code> to show, <code>disabled</code> and <code>danger</code>.
		</li>
		<li><code>{'{ separator: true }'}</code> draws a line between groups.</li>
		<li>
			<code>{'{ heading: "Export" }'}</code> names the actions after it, up to the next heading or separator,
			for screen readers as well.
		</li>
	</ul>

	<h2 id="keyboard">Keyboard</h2>
	<ul>
		<li>
			On the button, <kbd>Enter</kbd>, <kbd>Space</kbd> and <kbd>↓</kbd> open the menu at the first
			item, <kbd>↑</kbd> at the last.
		</li>
		<li>
			<kbd>↓</kbd> and <kbd>↑</kbd> move and wrap around, <kbd>Home</kbd> and <kbd>End</kbd> jump to the
			ends, and typing moves to the item that starts with it. Disabled items are skipped.
		</li>
		<li>
			<kbd>Enter</kbd> and <kbd>Space</kbd> choose. <kbd>Escape</kbd> closes and gives focus back to
			the button; <kbd>Tab</kbd> closes and moves on.
		</li>
		<li>
			The pointer and the keyboard share one highlight: the item under the pointer takes focus.
		</li>
	</ul>

	<h2 id="icon-button">From an icon button</h2>
	<p>
		An icon button usually carries a <a href={resolve('overlays/tooltip')}>Tooltip</a> as well: nest
		the two snippets and spread both sets of attributes onto it. The button still needs its own
		<code>aria-label</code>, which also names the menu.
	</p>
	<Code title="MoreActions.svelte" code={menuIconButton} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The button has <code>aria-haspopup="menu"</code>, <code>aria-expanded</code> and
			<code>aria-controls</code>; the menu is <code>role="menu"</code>, named by the button, with
			<code>menuitem</code> rows, <code>group</code>s named by their headings, and
			<code>separator</code>s.
		</li>
		<li>
			A menu holds actions. For a choice that stays selected, use a <a
				href={resolve('forms/radio-group')}>RadioGroup</a
			>
			or a <a href={resolve('forms/native-select')}>NativeSelect</a>; for fields, a
			<a href={resolve('overlays/popover')}>Popover</a>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Menu props" rows={MENU_PROPS} />
	<ApiTable label="MenuAction" rows={MENU_ACTION} />
</DocPage>
