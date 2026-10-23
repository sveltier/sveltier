<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import KeyboardDemo from '#lib/docs/KeyboardDemo.svelte';
	import { KEYMAP_API, TYPEAHEAD_OPTIONS } from '#lib/docs/api.js';
	import { keymapExample, typeaheadExample } from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Keyboard"
	lede="Bind keys the same way in every component, and let users jump through long lists by typing."
>
	<h2 id="typeahead">Typeahead</h2>
	<p>
		In a menu, listbox or tree, typing moves focus to the next item whose label starts with what was
		typed. Keystrokes close together build one search, and repeating a character cycles through the
		items that start with it.
	</p>
	<KeyboardDemo />
	<Code title="Currency.svelte" code={typeaheadExample} />
	<ApiTable label="typeahead options" rows={TYPEAHEAD_OPTIONS} />

	<h2 id="keymap">Key maps</h2>
	<p>
		<code>keymap()</code> binds keys to handlers and prevents the browser's default only for keys it handled,
		so everything else keeps working. Forward and backward arrows follow the writing direction, which
		keeps sliders and tabs right in right-to-left layouts.
	</p>
	<Code title="Allocation.svelte" code={keymapExample} />
	<ApiTable label="keymap" rows={KEYMAP_API} />
</DocPage>
