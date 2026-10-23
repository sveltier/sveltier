<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ProgressDemo from '#lib/docs/progress/ProgressDemo.svelte';
	import { progressUsage } from '#lib/snippets/components.js';
	import CIRCULAR_PROPS from 'virtual:sveltier-api/ProgressCircularProps';
	import LINEAR_PROPS from 'virtual:sveltier-api/ProgressLinearProps';
</script>

<DocPage
	title="Progress"
	lede="Shows how far along a task is, or that it is busy, as a bar or a circle."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give <code>value</code> from 0 to 100, or <code>indeterminate</code> when the length of the wait is
		unknown. The bar fills by scaling, so it stays smooth; the circle can hold a label in its centre.
	</p>
	<ProgressDemo />
	<Code title="Upload.svelte" code={progressUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Both are a <code>progressbar</code> with <code>aria-valuenow</code>, which is left out while
			indeterminate.
		</li>
		<li>
			Name each one for what it measures with <code>label</code>; without it, they are called
			"Progress" or, while indeterminate, "Loading".
		</li>
		<li>
			With reduced motion, a busy bar pulses in place instead of crossing, and a busy circle turns
			slowly rather than stopping, so the page does not look frozen.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="ProgressLinear props" rows={LINEAR_PROPS} />
	<ApiTable label="ProgressCircular props" rows={CIRCULAR_PROPS} />
</DocPage>
