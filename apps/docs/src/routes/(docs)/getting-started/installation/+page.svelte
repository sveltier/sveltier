<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { pageHref } from '#lib/docs/href.js';
	import { install } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Installation"
	lede="Add Sveltier to a Svelte 5 project. One package, no runtime dependencies, types included."
>
	<aside class="docs-note" aria-label="Status">
		<strong>Alpha.</strong> The API may still change between releases, so pin the version you install.
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
			<code>UIProvider</code> and the core: theming, defaults, shared props, breakpoints and locale.
		</li>
		<li>
			Five theme packs: Monolith (the one to start with), Heritage, Aurora, Maison and Milano, each
			in light and dark.
		</li>
		<li>Components, as they land, each with its own small stylesheet.</li>
		<li>Full TypeScript types, including the props type of every component.</li>
	</ul>
	<p>
		There is no global stylesheet to import. Each component imports its own CSS, and the root
		provider brings the design tokens and a minimal base. Everything sits in the
		<code>sv.*</code> cascade layers, so your own unlayered CSS always wins.
	</p>

	<h2 id="typescript">TypeScript</h2>
	<p>
		Types ship with the package. Theme packs are also available as subpath imports such as
		<code>@sveltier/ui/themes/maison</code>; use <code>"moduleResolution": "bundler"</code> (the SvelteKit
		and Vite default) so TypeScript resolves them.
	</p>

	<h2 id="agents">AI coding agents</h2>
	<p>
		The package carries its own docs for agents, generated from the same types your editor checks:
		<code>llms.txt</code> (setup, conventions and an index), <code>llms-full.txt</code>, one
		Markdown page per component in <code>docs/</code>, and <code>components.json</code>. Hook your
		app's agents up to them once:
	</p>
	<Code title="Terminal" lang="sh" code="npx sveltier init" />
	<p>
		It writes a Sveltier section into <code>AGENTS.md</code> pointing at
		<code>node_modules/@sveltier/ui/llms.txt</code>, replaced in place when you run it again after
		an upgrade. If the app has a <code>CLAUDE.md</code>, it imports <code>AGENTS.md</code> there
		too. If the app has a <code>.claude</code> folder, it installs the Sveltier skill. In a
		workspace, run it in the app's folder (<code>pnpm --filter &lt;app&gt; exec sveltier init</code
		>): it finds the repository root above, where <code>CLAUDE.md</code> and <code>.claude</code>
		usually live. The skill goes in the root's <code>.claude</code>, or the app's when the root has
		none, so agents find one copy.
	</p>
	<!-- eslint-disable svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
	<p>
		On the web, the same reference is at <a href={pageHref('llms.txt')} data-sveltekit-reload
			>llms.txt</a
		>
		and <a href={pageHref('llms-full.txt')} data-sveltekit-reload>llms-full.txt</a>.
	</p>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<h2 id="next">Next</h2>
	<p>
		Wrap your app in a provider in the <a href={resolve('getting-started/quick-start')}
			>quick start</a
		>, then install the <a href={resolve('getting-started/fonts')}>fonts</a> of the theme you use.
	</p>
</DocPage>
