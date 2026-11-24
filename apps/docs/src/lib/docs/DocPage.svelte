<script lang="ts">
	// Shared frame of every documentation page: eyebrow (nav group), title, lede and body.
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import { locate, toNavPath } from './nav.js';

	let {
		title,
		lede,
		children
	}: {
		title: string;
		/** One or two sentences under the title; also the page's meta description. */
		lede?: string;
		children: Snippet;
	} = $props();

	const group = $derived(locate(toNavPath(page.url.pathname)).current?.group);
	// Absolute, as link previews require.
	const socialCard = $derived(new URL(asset('social-card.png'), page.url.href).href);
</script>

<svelte:head>
	<title>{title} · Sveltier</title>
	{#if lede}
		<meta name="description" content={lede} />
		<meta property="og:description" content={lede} />
	{/if}
	<meta property="og:title" content="{title} · Sveltier" />
	<meta property="og:type" content="article" />
	<meta property="og:image" content={socialCard} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={socialCard} />
</svelte:head>

<header class="doc-head">
	{#if group}<span class="docs-label">{group}</span>{/if}
	<h1>{title}</h1>
	{#if lede}<p class="docs-lede">{lede}</p>{/if}
</header>

<div class="doc-body">
	{@render children()}
</div>
