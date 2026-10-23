<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Sveltier: a UI framework for Svelte 5</title>
	<meta
		name="description"
		content="Sveltier is a fast, typed UI framework for Svelte 5 with five built-in design languages and a zero-dependency theme engine."
	/>
</svelte:head>

<section class="docs-hero" aria-labelledby="hero-title">
	<span class="docs-label">Pre-alpha · Svelte 5</span>
	<h1 id="hero-title">Five design languages. One engine.</h1>
	<p class="docs-lede">
		Sveltier is a UI framework for Svelte 5: one shared system for theme, defaults, density and
		layout, a wide set of components built on it, and five design languages you switch with one
		line. Made to be written quickly and correctly, by developers and by AI coding agents.
	</p>
	<ul class="docs-principles">
		<li>
			<strong>Fast</strong><span
				>Zero runtime dependencies, a size budget on every entry, flash-free server rendering.</span
			>
		</li>
		<li>
			<strong>Predictable</strong><span
				>One prop vocabulary across components, strict types, a typed theme contract and errors that
				say how to fix them.</span
			>
		</li>
		<li>
			<strong>Luxurious</strong><span
				>Monolith, Heritage, Aurora, Maison and Milano: complete design languages, not colour swaps.</span
			>
		</li>
	</ul>
	<a class="docs-link" href={resolve('/theme')}>See the five themes →</a>
</section>
