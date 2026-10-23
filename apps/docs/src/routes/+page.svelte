<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Sveltier: a UI framework for Svelte 5</title>
	<meta
		name="description"
		content="Sveltier is a UI framework for Svelte 5 with the Engraved Instrument design language for premium fintech products."
	/>
</svelte:head>

<section class="docs-hero" aria-labelledby="hero-title">
	<span class="docs-label">Pre-alpha · Svelte 5</span>
	<h1 id="hero-title">Instruments, engraved.</h1>
	<p class="docs-lede">
		Sveltier is a UI framework for Svelte 5, built the way Vuetify is built for Vue: shared theme,
		defaults, density and layout mechanisms, then a wide set of components. Its design language,
		Engraved Instrument, is made for premium fintech: serif numerals, hairline rules, quiet motion.
	</p>
	<ul class="docs-principles">
		<li>
			<strong>Smooth</strong><span>Only transform and opacity move. Reduced motion respected.</span>
		</li>
		<li>
			<strong>Light</strong><span>Zero runtime dependencies. Every entry has a size budget.</span>
		</li>
		<li>
			<strong>Luxurious</strong><span>oklch colour, cascade layers, flash-free SSR theming.</span>
		</li>
	</ul>
	<a class="docs-link" href={resolve('/theme')}>Explore the theme →</a>
</section>
