<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ChipDemo from '#lib/docs/chip/ChipDemo.svelte';
	import { chipClosable, chipFilter, chipHint } from '#lib/snippets/components.js';
	import CHIP_PROPS from 'virtual:sveltier-api/ChipProps';
</script>

<DocPage
	title="Chip"
	lede="A compact pill for filters that toggle, tags that can be removed, small actions and statuses."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Chip is a tonal pill a small control tall. What it is depends on what you give it: plain, it
		is a label; with <code>selected</code>, a toggle; with <code>onclick</code>, a button; with
		<code>href</code>, a link.
	</p>
	<ChipDemo />

	<h2 id="filters">Filters</h2>
	<p>
		Bind <code>selected</code> and the chip becomes a toggle button that flips it when pressed. Off,
		it is outlined; on, it takes its <code>variant</code> (tonal unless you set one) and shows a check,
		so a row of active filters stays calm and the state does not rely on colour alone.
	</p>
	<Code title="Filters.svelte" code={chipFilter} />

	<h2 id="closable">Removable tags</h2>
	<p>
		<code>closable</code> adds a close button that calls <code>onclose</code>. Name it for what it
		removes with <code>closeLabel</code>. A chip that is itself a button or a link cannot also be
		closable, since one control would sit inside another; put the action in a Button next to it.
	</p>
	<Code title="Currencies.svelte" code={chipClosable} />

	<h2 id="hint">A hint on a tag</h2>
	<p>
		A tag that needs explaining, such as <q>SIM</q> on simulated data, takes a Tooltip: the chip is
		its trigger, with <code>tabindex={'{0}'}</code> so the keyboard reaches it, and the Tooltip
		describes it on hover and on focus. A <code>title</code> shows to neither touch nor keyboard users.
		Keep the hint short and the tag's own text meaningful.
	</p>
	<Code title="SimTag.svelte" code={chipHint} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A filter chip is a <code>&lt;button&gt;</code> with <code>aria-pressed</code>, pressed with
			<kbd>Enter</kbd> or <kbd>Space</kbd>.
		</li>
		<li>The close button is its own button in the tab order, named by <code>closeLabel</code>.</li>
		<li>A plain chip is text, not a control: it is read but not focused.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Chip props" rows={CHIP_PROPS} />
</DocPage>
