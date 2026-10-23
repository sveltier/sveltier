<script lang="ts">
	// Fonts for all five theme packs. Fontsource declares @font-face rules only; the browser
	// downloads a file the first time a theme actually uses that family.
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import '@fontsource/instrument-serif/400.css';
	import '@fontsource-variable/instrument-sans';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/jetbrains-mono';
	import '@fontsource-variable/cormorant-garamond';
	import '@fontsource-variable/jost';
	import '@fontsource/dm-mono/400.css';
	import '@fontsource/dm-mono/500.css';
	import '@fontsource-variable/bodoni-moda/opsz.css';
	import '@fontsource/titillium-web/400.css';
	import '@fontsource/titillium-web/600.css';
	import '@fontsource/titillium-web/700.css';
	import '../app.css';
	import SiteHeader from '#lib/SiteHeader.svelte';
	import { THEMES, type PackId } from '#lib/site.js';
	import { ThemeProvider } from 'sveltier';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let pack = $state<PackId>('monolith');
</script>

<ThemeProvider themes={THEMES} light="{pack}-light" dark="{pack}-dark">
	<SiteHeader bind:pack />
	<main class="docs-wrap docs-main">
		{@render children()}
	</main>
	<footer class="docs-wrap docs-foot">Sveltier is pre-alpha. MIT licensed.</footer>
</ThemeProvider>
