<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import ComboboxDemo from '#lib/docs/combobox/ComboboxDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { comboboxRemote, comboboxUsage } from '#lib/snippets/forms.js';
	import COMBOBOX_PROPS from 'virtual:sveltier-api/ComboboxProps';
</script>

<DocPage
	title="Combobox"
	lede="One value found by typing: the list under the field keeps the items that match, whatever the case or the diacritics."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>items</code>, the same items a
		<a href={resolve('forms/select')}>Select</a> takes, and bind the <code>value</code>. Typing
		filters the list and points at the first match, so a few letters and <kbd>Enter</kbd> choose. The
		list opens on every item until the user types.
	</p>
	<ComboboxDemo />
	<Code title="City.svelte" code={comboboxUsage} />

	<h2 id="matching">Matching</h2>
	<p>
		Every word typed must appear in the label or the description, in any order, ignoring case and
		diacritics: <q>sao</q> finds São Paulo, <q>da nang</q> finds Đà Nẵng, <q>usdt</q> finds BTCUSDT.
		Items keep their order. <code>filter</code> takes a function of the item and the query for other rules.
	</p>

	<h2 id="remote">Searching elsewhere</h2>
	<p>
		To search on a server, bind <code>query</code>, pass <code>filter=&#123;false&#125;</code> and
		give the items found; <code>loading</code> says so while there are none yet.
	</p>
	<Code title="Symbol.svelte" code={comboboxRemote} />

	<h2 id="leaving">Leaving the field</h2>
	<p>
		The value changes only when an option is chosen. Leaving the field puts the chosen label back
		over what was typed, and leaving it empty clears the value. The form submits the chosen value
		under
		<code>name</code>, never the typed text.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The field is an <code>&lt;input&gt;</code> in the <code>combobox</code> role, with
			<code>aria-autocomplete="list"</code>; <code>aria-activedescendant</code> names the option the keys
			point at, and focus stays in the field.
		</li>
		<li>
			<kbd>↓</kbd> and <kbd>↑</kbd> open the list and move, <kbd>Page Up</kbd> and
			<kbd>Page Down</kbd> by ten; <kbd>Enter</kbd> chooses; <kbd>Escape</kbd> closes the list, then
			puts back the chosen label. <kbd>Home</kbd> and <kbd>End</kbd> stay with the text.
		</li>
		<li>
			An <kbd>Enter</kbd> that confirms a word of an input method, as Vietnamese, Chinese or Japanese
			typing uses, never chooses an option.
		</li>
		<li>When nothing matches, the list says so through a status, which screen readers announce.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Combobox props" rows={COMBOBOX_PROPS} />
</DocPage>
