<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ButtonGroupDemo from '#lib/docs/button-group/ButtonGroupDemo.svelte';
	import { buttonGroupUsage } from '#lib/snippets/components.js';
	import BUTTON_GROUP_PROPS from 'virtual:sveltier-api/ButtonGroupProps';
</script>

<DocPage
	title="ButtonGroup"
	lede="Related actions joined into one control, with shared borders and one set of props for every button."
>
	<h2 id="usage">Usage</h2>
	<p>
		Put <a href={resolve('components/button')}>Buttons</a> in a ButtonGroup. They touch, share their
		borders, keep the group's rounding on the outer corners only, and take its
		<code>variant</code>, <code>size</code>, <code>density</code> and <code>color</code>, outlined
		by default. A prop on a Button still wins.
	</p>
	<ButtonGroupDemo />
	<Code title="Export.svelte" code={buttonGroupUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The group has <code>role="group"</code>: name it with <code>aria-label</code> so its buttons are
			heard as a set.
		</li>
		<li>
			Each button stays its own stop in the tab order. For one choice among options, use a
			SegmentedControl, which is a radio group with one tab stop.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="ButtonGroup props" rows={BUTTON_GROUP_PROPS} />
</DocPage>
