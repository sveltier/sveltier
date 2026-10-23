<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { THEME_CSS } from '#lib/docs/api.js';
	import { csp } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="themeCss and themeScript"
	lede="The low-level functions behind ThemeProvider: the theme stylesheet and the render-blocking restore script."
>
	<h2 id="when">When to use them</h2>
	<p>
		<code>ThemeProvider</code> calls both for you. Use them directly to precompute the stylesheet, to
		serve it from your own server template, or to hash the script for a Content Security Policy.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="themeCss and themeScript" rows={THEME_CSS} />

	<h2 id="csp">Content Security Policy</h2>
	<Code title="CSP" code={csp} />
	<p>
		See <a href={resolve('getting-started/server-rendering')}>Server-side rendering</a> for how the pieces
		fit together.
	</p>
</DocPage>
