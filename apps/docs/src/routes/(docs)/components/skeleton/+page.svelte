<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SkeletonDemo from '#lib/docs/skeleton/SkeletonDemo.svelte';
	import { skeletonUsage } from '#lib/snippets/components.js';
	import SKELETON_PROPS from 'virtual:sveltier-api/SkeletonProps';
</script>

<DocPage
	title="Skeleton"
	lede="Placeholders in the shape of content that is still loading, so the page does not jump when it arrives."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>text</code> draws lines as tall as the text around them, the last of several shorter;
		<code>rect</code> is a golden rectangle across its container, for an image or a chart;
		<code>circle</code> stands in for an avatar. A highlight sweeps across while it waits.
	</p>
	<SkeletonDemo />
	<Code title="LatestTransfer.svelte" code={skeletonUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		Skeletons are hidden from screen readers. Mark the region that is loading with
		<code>aria-busy="true"</code> and remove it when the content is in, so assistive technology waits
		for the real content. Under reduced motion the highlight does not sweep.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="Skeleton props" rows={SKELETON_PROPS} />
</DocPage>
