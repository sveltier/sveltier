<script lang="ts">
	import { resolve } from '$app/paths';
	import DocPage from '#lib/docs/DocPage.svelte';
	import PackGallery from '#lib/docs/PackGallery.svelte';
	import { PACKS } from '#lib/site.js';
</script>

<DocPage
	title="Theme packs"
	lede="Five complete design languages, each in light and dark. Every pack fulfils the same contract and passes the same contrast checks, so you can switch without touching a component."
>
	<h2 id="gallery">Try them</h2>
	<p>Each tile is a nested <code>ThemeProvider</code>. Apply one to the whole site.</p>
	<PackGallery />

	<h2 id="compare">Compare</h2>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Theme pack comparison" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Pack</th>
					<th scope="col">Shape</th>
					<th scope="col">Motion</th>
					<th scope="col">Suits</th>
				</tr>
			</thead>
			<tbody>
				{#each PACKS as pack (pack.id)}
					<tr>
						<td><a href={resolve(`theme-packs/${pack.id}`)}>{pack.name}</a></td>
						<td>{pack.shape}</td>
						<td>{pack.motion}</td>
						<td>{pack.suits}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="size">Size</h2>
	<p>
		Monolith ships with <code>ThemeProvider</code>. Every other pack is a separate import of about 1
		KB gzipped, and only the packs you import end up in your bundle.
	</p>
</DocPage>
