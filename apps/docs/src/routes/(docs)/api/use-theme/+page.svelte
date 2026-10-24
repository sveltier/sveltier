<script lang="ts">
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
		Call it during component initialisation, inside a <code>ThemeProvider</code>. Outside one it
		throws <code>[sveltier] useTheme() must be called inside a &lt;ThemeProvider&gt;.</code>
	</p>

	<h2 id="returns">Returns</h2>
	<ApiTable label="ThemeInstance" rows={THEME_INSTANCE} />

	<h2 id="example">Example</h2>
	<Code title="Theme toggle" code={toggle} />
</DocPage>
