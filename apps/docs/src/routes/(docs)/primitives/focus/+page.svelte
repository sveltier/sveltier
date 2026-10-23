<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import RovingDemo from '#lib/docs/RovingDemo.svelte';
	import TrapDemo from '#lib/docs/TrapDemo.svelte';
	import { FOCUS_TRAP_OPTIONS, ROVING_FOCUS_OPTIONS } from '#lib/docs/api.js';
	import {
		attachIntro,
		rovingExample,
		tabbableExample,
		trapExample
	} from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Focus"
	lede="Keep focus where it belongs: trapped in a dialog or sheet, roving inside a toolbar or radio group, and given back when the surface closes."
>
	<h2 id="primitives">Primitives</h2>
	<p>
		Primitives are the behaviour Sveltier's components are built on, exported for your own elements.
		Each one is an attachment: it runs in the browser only, starts and stops with a condition, and
		cleans up when the element goes away.
	</p>
	<Code title="Attachments" code={attachIntro} />

	<h2 id="focus-trap">Focus trap</h2>
	<p>
		<code>focusTrap()</code> moves focus inside, wraps Tab and Shift+Tab at the edges, and brings focus
		back when a pointer or a script moves it out. When it ends, focus returns to where it was. Traps stack:
		one opened inside another takes over until it ends.
	</p>
	<TrapDemo />
	<Code title="Transfer.svelte" code={trapExample} />
	<ApiTable label="focusTrap options" rows={FOCUS_TRAP_OPTIONS} />

	<h2 id="roving-focus">Roving focus</h2>
	<p>
		<code>rovingFocus()</code> gives a composite widget one tab stop. The arrow keys move between items,
		Home and End jump to the ends, disabled items are skipped, and the first stop is the item marked selected,
		checked or current.
	</p>
	<RovingDemo />
	<Code title="Range.svelte" code={rovingExample} />
	<ApiTable label="rovingFocus options" rows={ROVING_FOCUS_OPTIONS} />

	<h2 id="tabbable">Tabbable elements</h2>
	<p>
		Both are built on <code>tabbable()</code>, which lists what Tab reaches in a container, in Tab
		order: positive <code>tabindex</code> first, one stop per radio group, nothing disabled, hidden,
		inert or inside a closed <code>&lt;details&gt;</code>.
	</p>
	<Code title="tabbable()" lang="ts" code={tabbableExample} />
</DocPage>
