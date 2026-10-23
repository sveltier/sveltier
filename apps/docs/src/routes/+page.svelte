<script lang="ts">
	import { resolve } from '$app/paths';
	import PackGallery from '#lib/docs/PackGallery.svelte';
</script>

<svelte:head>
	<title>Sveltier: a UI framework for Svelte 5</title>
	<meta
		name="description"
		content="Sveltier is a fast, typed UI framework for Svelte 5 with five built-in design languages and a zero-dependency theme engine."
	/>
</svelte:head>

<main class="docs-wrap docs-landing" id="main">
	<section class="docs-hero" aria-labelledby="hero-title">
		<span class="docs-label">Pre-alpha · Svelte 5</span>
		<h1 id="hero-title">Five design languages. One engine.</h1>
		<p class="docs-lede">
			Sveltier is a UI framework for Svelte 5: one shared system for theme, defaults, density and
			layout, a wide set of components built on it, and five design languages you switch with one
			line. Made to be written quickly and correctly, by developers and by AI coding agents.
		</p>
		<div class="docs-actions">
			<a class="docs-button docs-button--primary" href={resolve('getting-started/installation')}
				>Get started</a
			>
			<a class="docs-button" href={resolve('theme-packs')}>Browse the themes</a>
		</div>
	</section>

	<section aria-labelledby="principles-title">
		<h2 class="docs-visually-hidden" id="principles-title">Principles</h2>
		<ul class="docs-principles">
			<li>
				<strong>Fast</strong>
				<span
					>Zero runtime dependencies, a size budget on every entry, flash-free server rendering.</span
				>
			</li>
			<li>
				<strong>Predictable</strong>
				<span
					>One prop vocabulary, strict types, a typed theme contract and errors that say how to fix
					them.</span
				>
			</li>
			<li>
				<strong>Accessible</strong>
				<span
					>Keyboard behaviour from the WAI-ARIA Authoring Practices; every theme passes WCAG
					contrast checks.</span
				>
			</li>
			<li>
				<strong>Luxurious</strong>
				<span
					>Monolith, Heritage, Aurora, Maison and Milano: complete design languages, not colour
					swaps.</span
				>
			</li>
		</ul>
	</section>

	<section aria-labelledby="packs-title" class="docs-landing__packs">
		<div class="docs-section-head">
			<h2 id="packs-title">Five design languages</h2>
			<p>Each tile is a nested <code>ThemeProvider</code>. Apply one to the whole site.</p>
		</div>
		<PackGallery />
	</section>

	<footer class="docs-foot">
		Sveltier is pre-alpha. MIT licensed.
		<a href="https://github.com/sveltier/sveltier" rel="external">Source on GitHub</a>
	</footer>
</main>
