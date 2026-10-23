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
	import AppBar from '#lib/docs/AppBar.svelte';
	import { createShell } from '#lib/docs/shell.svelte.js';
	import { THEMES, type PackId } from '#lib/site.js';
	import { UIProvider } from 'sveltier';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let pack = $state<PackId>('monolith');
	createShell();
</script>

<UIProvider themes={THEMES} light="{pack}-light" dark="{pack}-dark">
	<a class="docs-skip" href="#main">Skip to content</a>
	<AppBar bind:pack />
	{@render children()}
</UIProvider>
