<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import GridDemo from '#lib/docs/grid/GridDemo.svelte';
	import { gridSplit, gridUsage } from '#lib/snippets/layout.js';
	import COL_PROPS from 'virtual:sveltier-api/ColProps';
	import CONTAINER_PROPS from 'virtual:sveltier-api/ContainerProps';
	import ROW_PROPS from 'virtual:sveltier-api/RowProps';
</script>

<DocPage
	title="Grid"
	lede="Twelve columns on a CSS grid: a Row holds Cols that span some of them, with spans that change at the breakpoints, inside a Container that sets the width of the page."
>
	<h2 id="usage">Usage</h2>
	<p>
		A <code>Row</code> has twelve equal columns. Each <code>Col</code> spans some of them: twelve unless
		it says otherwise. A column that does not fit on a line starts the next one, so cards flow into as
		many lines as they need.
	</p>
	<GridDemo />
	<Code code={gridUsage} />

	<h2 id="spans">Spans that change with the screen</h2>
	<p>
		<code>cols</code> is the span on every screen. <code>sm</code>, <code>md</code>,
		<code>lg</code>, <code>xl</code> and <code>xxl</code> take over from that breakpoint's width up,
		mobile first: <code>cols=&#123;12&#125; md=&#123;4&#125;</code> stacks on a phone and makes
		thirds from 960px. The widths are the window's, as <code>useDisplay()</code> names them, at
		their default values (<code>sm</code> 600px, <code>md</code> 960px, <code>lg</code> 1280px,
		<code>xl</code> 1920px, <code>xxl</code> 2560px). They apply in CSS, so the server sends the right
		layout before any script runs.
	</p>
	<Code code={gridSplit} />

	<h2 id="gap">Gap and alignment</h2>
	<p>
		<code>gap</code> is the space between columns and between lines, on the space scale:
		<code>21</code> (the default) is <code>--sv-space-21</code>, and <code>0</code> joins them.
		<code>align</code> places the columns in the height of their line; <code>stretch</code>, the
		default, makes the columns of a line as tall as the tallest, so cards side by side line up.
		<code>justify</code> places each column's content across the columns it spans.
	</p>

	<h2 id="nesting">Rows inside columns</h2>
	<p>
		A <code>Row</code> inside a <code>Col</code> has twelve columns of its own, and the spans of the outer
		column do not reach the columns inside it.
	</p>

	<h2 id="container">Container</h2>
	<p>
		<code>Container</code> centres the content of a page with room at the sides: 13px on a phone,
		21px from <code>sm</code> up. Its <code>size</code> is the most it spans, on half steps of φ:
		<code>xs</code> 42.36rem, <code>sm</code> 53.88rem, <code>md</code> 68.54rem, <code>lg</code>
		87.19rem (the default) and <code>xl</code> 110.9rem. <code>fluid</code> takes the full width. In
		an app layout it goes inside <code>Main</code>, which adds no padding of its own.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="Container props" rows={CONTAINER_PROPS} />
	<ApiTable label="Row props" rows={ROW_PROPS} />
	<ApiTable label="Col props" rows={COL_PROPS} />
</DocPage>
