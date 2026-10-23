<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { THEME_PROVIDER_PROPS } from '#lib/docs/api.js';
	import { nested, setup } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="ThemeProvider"
	lede="Registers themes, writes their stylesheet, remembers the user's choice and scopes a theme to its subtree."
>
	<h2 id="import">Import</h2>
	<Code
		title="Import"
		lang="ts"
		code={"import { ThemeProvider, type ThemeProviderProps } from 'sveltier';"}
	/>

	<h2 id="props">Props</h2>
	<ApiTable label="ThemeProvider props" rows={THEME_PROVIDER_PROPS} />

	<h2 id="root-nested">Root and nested</h2>
	<p>
		The first <code>ThemeProvider</code> in the tree is the root. It renders no element, puts the
		theme stylesheet (and the restore script) in <code>&lt;head&gt;</code> and marks
		<code>&lt;html data-sv-theme&gt;</code>. Providers below it render a wrapper element with their
		own <code>data-sv-theme</code> and inherit the root's themes.
	</p>
	<Code title="Root" code={setup} />
	<Code title="Nested" code={nested} />

	<h2 id="context">Context</h2>
	<p>
		Every provider exposes itself to its descendants. Read it with
		<a href={resolve('api/use-theme')}>useTheme()</a>.
	</p>
</DocPage>
