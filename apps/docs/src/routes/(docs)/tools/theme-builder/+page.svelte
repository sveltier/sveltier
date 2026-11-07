<script lang="ts">
	import { resolve } from '$app/paths';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ThemeBuilder from '#lib/builder/ThemeBuilder.svelte';
</script>

<DocPage
	title="Theme builder"
	lede="Start from a theme pack, change its colours, corners and fonts, and watch real components follow. Check the contrast, then copy the defineTheme() code."
>
	<p>
		The builder writes only what you change over the pack you start from, so your theme keeps
		everything else: motion, depth and the rest of the <a href={resolve('theming/contract')}
			>theme contract</a
		>. The address keeps your work; copy it to come back later. See
		<a href={resolve('theming/custom-themes')}>Custom themes</a> for what defineTheme() does with it.
	</p>

	<h2 id="base">Base theme and preview</h2>
	<ThemeBuilder />
</DocPage>
