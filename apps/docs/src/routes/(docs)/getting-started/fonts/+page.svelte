<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { PACKS } from '#lib/site.js';
	import { fonts } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Fonts"
	lede="Sveltier does not bundle fonts. Each theme names its families and falls back to system fonts, so you choose where fonts come from."
>
	<h2 id="why">Why fonts are not bundled</h2>
	<p>
		Fonts are the heaviest part of a design language. Bundling them would charge every app for
		families it may not use and take hosting, licensing and subsetting decisions away from you. A
		theme only names the families in <code>--sv-font-display</code>, <code>--sv-font-ui</code> and
		<code>--sv-font-data</code>, each ending in system fallbacks, so the interface works before or
		without them.
	</p>

	<h2 id="per-pack">Fonts per theme pack</h2>
	<p>All families are open source and available as self-hosted Fontsource packages.</p>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Fonts per theme pack" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Pack</th>
					<th scope="col">Families</th>
					<th scope="col">Install</th>
				</tr>
			</thead>
			<tbody>
				{#each PACKS as pack (pack.id)}
					<tr>
						<td>{pack.name}</td>
						<td>{pack.type}</td>
						<td><code class="docs-dim">pnpm add {pack.install}</code></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="load">Load them</h2>
	<p>
		Import the font CSS once, next to the provider. Fontsource only declares
		<code>@font-face</code> rules; the browser downloads a file the first time a family is used.
	</p>
	<Code title="Monolith" code={fonts} />

	<h2 id="performance">Performance tips</h2>
	<ul>
		<li>
			Prefer the variable packages (<code>@fontsource-variable/…</code>): one file per family.
		</li>
		<li>Import only the weights you use with static packages, for example <code>400.css</code>.</li>
		<li>
			Preload the display font of your hero if it is above the fold, and nothing else, to protect
			Largest Contentful Paint.
		</li>
	</ul>
</DocPage>
