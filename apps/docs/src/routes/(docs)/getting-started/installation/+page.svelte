<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { install } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Installation"
	lede="Add Sveltier to a Svelte 5 project. One package, no runtime dependencies, types included."
>
	<aside class="docs-note" aria-label="Status">
		<strong>Pre-alpha.</strong> Sveltier is not published to npm yet. The commands below are how installation
		will work from the first preview release.
	</aside>

	<h2 id="requirements">Requirements</h2>
	<ul>
		<li>
			<strong>Svelte 5.40 or newer.</strong> Sveltier uses runes, snippets and attachments only.
		</li>
		<li>
			<strong>A Vite-based setup</strong>, such as SvelteKit or Vite with
			<code>@sveltejs/vite-plugin-svelte</code>. Component styles are plain CSS files imported by
			the components, which Vite bundles and tree-shakes.
		</li>
		<li>
			<strong>A current browser.</strong> Colours use <code>oklch()</code> and
			<code>color-mix()</code>; styles live in cascade layers.
		</li>
	</ul>

	<h2 id="install">Install the package</h2>
	<div class="docs-grid-2">
		{#each Object.entries(install) as [manager, command] (manager)}
			<Code title={manager} lang="sh" code={command} />
		{/each}
	</div>

	<h2 id="what-you-get">What you get</h2>
	<ul>
		<li>
			<code>ThemeProvider</code>, <code>useTheme()</code> and <code>defineTheme()</code>: the theme
			engine.
		</li>
		<li>
			Five theme packs: Monolith (default), Heritage, Aurora, Maison and Milano, each in light and
			dark.
		</li>
		<li>Components, as they land, each with its own small stylesheet.</li>
		<li>Full TypeScript types, including the props type of every component.</li>
	</ul>
	<p>
		There is no global stylesheet to import. Each component imports its own CSS, and
		<code>ThemeProvider</code> brings the design tokens and a minimal base. Everything sits in the
		<code>sv.*</code> cascade layers, so your own unlayered CSS always wins.
	</p>

	<h2 id="typescript">TypeScript</h2>
	<p>
		Types ship with the package. Theme packs are also available as subpath imports such as
		<code>sveltier/themes/maison</code>; use <code>"moduleResolution": "bundler"</code> (the SvelteKit
		and Vite default) so TypeScript resolves them.
	</p>

	<h2 id="next">Next</h2>
	<p>
		Wrap your app in a provider in the <a href={resolve('getting-started/quick-start')}
			>quick start</a
		>, then install the <a href={resolve('getting-started/fonts')}>fonts</a> of the theme you use.
	</p>
</DocPage>
