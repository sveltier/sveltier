<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SelectDemo from '#lib/docs/select/SelectDemo.svelte';
	import { selectCustom, selectUsage } from '#lib/snippets/forms.js';
	import SELECT_ITEM_ROWS from 'virtual:sveltier-api/SelectItem';
	import SELECT_PROPS from 'virtual:sveltier-api/SelectProps';
</script>

<DocPage
	title="Select"
	lede="One value from a list that opens under the field: grouped, drawn your own way, and chosen with the keys as well as the pointer."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>items</code> and bind the <code>value</code>, which keeps the type of
		the item values, or is <code>null</code> while nothing is chosen. Items with a
		<code>group</code> show together under its name, in the order the groups first appear. A
		<code>description</code> shows under the label.
	</p>
	<SelectDemo />
	<Code title="Market.svelte" code={selectUsage} />

	<h2 id="custom">Options your own way</h2>
	<p>
		The <code>option</code> snippet draws each option and <code>selection</code> the chosen one in the
		field; both receive the item, with any extra properties you gave it.
	</p>
	<Code title="Markets.svelte" code={selectCustom} />

	<h2 id="choosing">Which select</h2>
	<ul>
		<li>
			<a href={resolve('forms/native-select')}>NativeSelect</a> is the platform's own list: the picker
			phones show, and nothing to load. Choose it for plain options on forms used on phones.
		</li>
		<li>
			Select is the same choice drawn by the page: groups, descriptions, options of your own, the
			theme's look in every browser.
		</li>
		<li>
			To search a long list as you type, use a <a href={resolve('forms/combobox')}>Combobox</a>.
		</li>
	</ul>

	<h2 id="validation">Forms and validation</h2>
	<p>
		<code>required</code>, <code>rules</code>, <code>validateOn</code> and <code>error</code> work
		as on every field, and <code>name</code> submits the value. Inside a
		<a href={resolve('forms/form')}>Form</a>, an empty required Select stops the submit and takes
		focus; a plain <code>&lt;form&gt;</code> does not check it.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The field is a <code>combobox</code>, named by its label, that keeps focus while the list is
			open; <code>aria-activedescendant</code> names the option the keys point at, and the chosen one
			carries a check.
		</li>
		<li>
			<kbd>↓</kbd>, <kbd>↑</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> open the list on the chosen
			option. <kbd>↓</kbd> <kbd>↑</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Page Up</kbd> and
			<kbd>Page Down</kbd> move, skipping disabled options; <kbd>Enter</kbd> or <kbd>Space</kbd>
			chooses; <kbd>Escape</kbd> closes; <kbd>Tab</kbd> chooses and moves on.
		</li>
		<li>Typing the start of a label goes to it, open or closed.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Select props" rows={SELECT_PROPS} />
	<ApiTable label="SelectItem" rows={SELECT_ITEM_ROWS} />
</DocPage>
