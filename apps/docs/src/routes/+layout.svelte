<script lang="ts">
	import '@fontsource/noto-serif-display/300.css';
	import '@fontsource/noto-serif-display/400.css';
	import '@fontsource/hanken-grotesk/400.css';
	import '@fontsource/hanken-grotesk/500.css';
	import '@fontsource/hanken-grotesk/600.css';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';
	import '../app.css';
	import SiteHeader from '#lib/SiteHeader.svelte';
	import { THEMES, type AccentName } from '#lib/site.js';
	import { ThemeProvider } from 'sveltier';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let accent = $state<AccentName>('champagne');
</script>

<ThemeProvider themes={THEMES} light="bone-{accent}" dark="ink-{accent}">
	<SiteHeader bind:accent />
	<main class="docs-wrap docs-main">
		{@render children()}
	</main>
	<footer class="docs-wrap docs-foot">
		Sveltier is pre-alpha. MIT licensed. Figures on these pages are illustrative.
	</footer>
</ThemeProvider>
