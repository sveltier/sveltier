<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SegmentedDemo from '#lib/docs/segmented/SegmentedDemo.svelte';
	import { segmentedUsage } from '#lib/snippets/components.js';
	import SEGMENTED_PROPS from 'virtual:sveltier-api/SegmentedControlProps';
</script>

<DocPage
	title="SegmentedControl"
	lede="One choice among a few options side by side, such as a chart range or a view."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>options</code> and bind the <code>value</code>. The segments are as
		wide as the widest, and the selected one slides into place. It is a raised surface by default;
		any variant and colour paints it.
	</p>
	<SegmentedDemo />
	<Code title="ChartRange.svelte" code={segmentedUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a radio group: one stop in the tab order, on the selected option. The arrow keys move
			and select, following the writing direction, and skip disabled options. Name it with
			<code>aria-label</code>.
		</li>
		<li>
			For actions rather than a choice, use a <a href={resolve('components/button-group')}
				>ButtonGroup</a
			>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="SegmentedControl props" rows={SEGMENTED_PROPS} />
</DocPage>
