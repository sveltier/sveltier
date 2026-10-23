<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { DEFINE_THEME } from '#lib/docs/api.js';
	import { defineCustom } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="defineTheme"
	lede="Builds a complete, contract-satisfying theme from a partial one."
>
	<h2 id="signature">Signature</h2>
	<Code
		title="Signature"
		lang="ts"
		code={"import { defineTheme, type ThemeInput, type ThemeDefinition } from 'sveltier';\n\nfunction defineTheme(input: ThemeInput, base: ThemeDefinition): ThemeDefinition;"}
	/>

	<h2 id="parameters">Parameters</h2>
	<ApiTable label="defineTheme parameters" rows={DEFINE_THEME} />

	<h2 id="example">Example</h2>
	<Code title="brand.ts" lang="ts" code={defineCustom} />

	<h2 id="size">Size</h2>
	<p>
		<code>defineTheme()</code> carries the colour maths that computes <code>on-</code> colours (under
		1 KB gzipped). The built-in theme packs do not need it; they ship precomputed values.
	</p>
	<p>
		More in <a href={resolve('theming/custom-themes')}>Custom themes</a>.
	</p>
</DocPage>
