<script lang="ts">
	// Shared frame of every documentation page: eyebrow (nav group), title, lede and body.
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
</script>

<svelte:head>
	<title>{title} · Sveltier</title>
	{#if lede}<meta name="description" content={lede} />{/if}
</svelte:head>

<header class="doc-head">
	{#if group}<span class="docs-label">{group}</span>{/if}
	<h1>{title}</h1>
	{#if lede}<p class="docs-lede">{lede}</p>{/if}
</header>

<div class="doc-body">
	{@render children()}
</div>
