<script lang="ts">
	import { page } from '$app/state';
	import { pageHref } from '#lib/docs/href.js';
	import Sidebar from '#lib/docs/Sidebar.svelte';
	import Toc from '#lib/docs/Toc.svelte';
	import { locate, toNavPath } from '#lib/docs/nav.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const position = $derived(locate(toNavPath(page.url.pathname)));
</script>

<div class="docs-layout">
	<Sidebar />
	<main class="docs-content" id="main">
		<article class="doc">
			{@render children()}
		</article>
		{#if position.previous || position.next}
			<nav class="docs-pager" aria-label="Previous and next page">
				{#if position.previous}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
					<a class="docs-pager__link" href={pageHref(position.previous.path)}>
						<span class="docs-label">Previous</span>
						<span>{position.previous.title}</span>
					</a>
				{/if}
				{#if position.next}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
					<a class="docs-pager__link docs-pager__link--next" href={pageHref(position.next.path)}>
						<span class="docs-label">Next</span>
						<span>{position.next.title}</span>
					</a>
				{/if}
			</nav>
		{/if}
		<footer class="docs-foot">
			Sveltier is in alpha. MIT licensed.
			<a href="https://github.com/sveltier/sveltier" rel="external">Source on GitHub</a>
		</footer>
	</main>
	<aside class="docs-aside">
		<Toc />
	</aside>
</div>
