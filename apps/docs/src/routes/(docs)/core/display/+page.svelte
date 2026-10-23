<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { displayExample } from '#lib/snippets/core.js';
	import { BREAKPOINTS, useDisplay } from 'sveltier';

	const display = useDisplay();
	// Where each breakpoint starts, in BREAKPOINTS order; thresholds are fixed at startup.
	const starts = [0, ...Object.values(display.thresholds)];
	const ranges = BREAKPOINTS.map((name, i) => {
		const next = starts[i + 1];
		return { name, from: starts[i] ?? 0, to: next === undefined ? undefined : next - 1 };
	});
</script>

<DocPage
	title="Display"
	lede="Reactive breakpoint flags for behaviour that depends on the viewport. Layout itself stays in CSS."
>
	<h2 id="breakpoints">Breakpoints</h2>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Breakpoints" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Name</th>
					<th scope="col" class="docs-num">From</th>
					<th scope="col" class="docs-num">To</th>
				</tr>
			</thead>
			<tbody>
				{#each ranges as range (range.name)}
					<tr>
						<td><code>{range.name}</code></td>
						<td class="docs-num">{range.from}px</td>
						<td class="docs-num">{range.to === undefined ? '–' : `${range.to}px`}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Your viewport right now: <strong>{display.name}</strong>, mobile
		<strong>{display.mobile ? 'yes' : 'no'}</strong>. Resize the window to watch it change.
	</p>

	<h2 id="usage">Usage</h2>
	<p>
		Call <code>useDisplay()</code> during component initialisation and read its flags; each one is reactive
		and only updates the component when its own threshold is crossed.
	</p>
	<Code title="OrderPanel.svelte" code={displayExample} />

	<h2 id="css-first">CSS first</h2>
	<p>
		Use CSS media and container queries for layout: they apply before any JavaScript runs. Use
		<code>useDisplay</code> for decisions CSS cannot make, such as which component to render or how much
		data to load.
	</p>

	<h2 id="server">Server rendering</h2>
	<p>
		The server cannot know the viewport, so it renders mobile first: <code>xs</code>, and
		<code>mobile</code> is true. On the client the real values apply at once, so content that depends
		on them can change right after hydration. Keep such content small, or give the server a width from
		client hints or a cookie when the app knows the device class.
	</p>
	<p>See <a href={resolve('api/use-display')}>useDisplay</a> for every flag.</p>
</DocPage>
