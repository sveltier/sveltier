<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import CommandPaletteDemo from '#lib/docs/command-palette/CommandPaletteDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { commandPaletteUsage } from '#lib/snippets/overlays.js';
	import COMMAND_PALETTE_PROPS from 'virtual:sveltier-api/CommandPaletteProps';
	import COMMAND_ITEM from 'virtual:sveltier-api/CommandItem';
</script>

<DocPage
	title="CommandPalette"
	lede="One search box over the app's places and actions, opened from anywhere with Ctrl+K."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give it the commands as <code>items</code> and run the one chosen in <code>onselect</code>.
		Commands can carry their own fields, such as an <code>href</code>, and
		<code>onselect</code> receives them typed. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd>+<kbd
			>K</kbd
		> on a Mac) or the button:
	</p>
	<CommandPaletteDemo />
	<Code title="GoTo.svelte" code={commandPaletteUsage} />

	<h2 id="searching">Searching</h2>
	<p>
		Every word typed must appear in the label, the description or the <code>keywords</code>,
		ignoring case and diacritics: "sol perp" finds SOL/USDT on a perpetual market, "preferences"
		finds Settings. The commands keep their order, and those of a <code>group</code> show together
		under its name. To search elsewhere, such as on a server, bind <code>query</code>, pass
		<code>filter=&#123;false&#125;</code> and the commands found, with <code>loading</code> while they
		come.
	</p>

	<h2 id="opening">Opening</h2>
	<p>
		<code>shortcut</code> opens it from anywhere on the page: <code>'Mod+K'</code> by default, where
		<code>Mod</code>
		is <kbd>⌘</kbd> on Apple platforms and <kbd>Ctrl</kbd> elsewhere.
		<code>false</code> binds nothing. A <code>trigger</code> opens it too, as a
		<a href={resolve('overlays/dialog')}>Dialog</a>'s does, and <code>bind:open</code> from code. It opens
		empty each time, on the first command.
	</p>

	<h2 id="keyboard">Keyboard</h2>
	<ul>
		<li>
			<kbd>↓</kbd> and <kbd>↑</kbd> move through the commands, skipping disabled ones;
			<kbd>Page Down</kbd>
			and <kbd>Page Up</kbd> move by ten.
		</li>
		<li>
			<kbd>Enter</kbd> runs the active command; while an input method composes a word, it confirms the
			word.
		</li>
		<li><kbd>Escape</kbd> closes it, and focus goes back where it was.</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a modal dialog with a combobox in it: focus stays in the search box, and
			<code>aria-activedescendant</code> names the active command, so a screen reader reads it as
			the keys move. <code>label</code> names both the dialog and the search box.
		</li>
		<li>
			A shortcut is invisible: show it on the trigger, as the example does, and offer the same
			places another way, such as the navigation.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="CommandPalette props" rows={COMMAND_PALETTE_PROPS} />
	<ApiTable label="CommandItem" rows={COMMAND_ITEM} />
</DocPage>
