<script lang="ts">
	import Gallery from '#lib/gallery/Gallery.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Gallery · {data.mode}, {data.accent}, {data.density} · Sveltier</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Gallery mode={data.mode} accent={data.accent} density={data.density} />
