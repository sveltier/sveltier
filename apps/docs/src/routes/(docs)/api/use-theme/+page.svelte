<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { THEME_INSTANCE } from '#lib/docs/api.js';
	import { toggle } from '#lib/snippets/theme.js';
</script>

<DocPage title="useTheme" lede="Returns the nearest ThemeProvider. Every field is reactive.">
	<h2 id="signature">Signature</h2>
	<Code
		title="Signature"
		lang="ts"
		code={"import { useTheme, type ThemeInstance } from '@sveltier/ui';\n\nfunction useTheme(): ThemeInstance;"}
	/>
	<p>
		Call it during component initialisation, inside a <code>UIProvider</code> or a
		<code>ThemeProvider</code>. Outside one it throws error
		<a href="{resolve('errors')}#SV1007"><code>SV1007</code></a>:
		<code
			>[sveltier SV1007] useTheme() was called outside a &lt;ThemeProvider&gt;. Call it in a
			component inside &lt;UIProvider&gt; or &lt;ThemeProvider&gt;.</code
		>
	</p>

	<h2 id="returns">Returns</h2>
	<ApiTable label="ThemeInstance" rows={THEME_INSTANCE} />

	<h2 id="example">Example</h2>
	<Code title="Theme toggle" code={toggle} />
</DocPage>
