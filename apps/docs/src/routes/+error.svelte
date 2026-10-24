<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Something went wrong'} · Sveltier</title>
</svelte:head>

<main class="docs-wrap docs-error" id="main">
	<p class="docs-label">Error {page.status}</p>
	<h1>{missing ? 'This page does not exist' : 'Something went wrong'}</h1>
	<p class="docs-lede">
		{missing
			? 'The link may be out of date, or the page has moved. The docs start from installation.'
			: (page.error?.message ?? 'Reload the page, or start again from the home page.')}
	</p>
	<div class="docs-actions">
		<a class="docs-button docs-button--primary" href={resolve('/')}>Home</a>
		<a class="docs-button" href={resolve('getting-started/installation')}>Installation</a>
	</div>
</main>
