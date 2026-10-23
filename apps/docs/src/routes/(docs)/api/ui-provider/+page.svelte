<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { UI_PROVIDER_PROPS } from '#lib/docs/api.js';
	import { setup } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="UIProvider"
	lede="The root of a Sveltier app: theme, defaults, breakpoints and locale in one component."
>
	<h2 id="props">Props</h2>
	<ApiTable label="UIProvider props" rows={UI_PROVIDER_PROPS} />

	<h2 id="example">Example</h2>
	<Code title="+layout.svelte" code={setup} />

	<h2 id="composition">What it renders</h2>
	<p>
		It gives everything below it the display and locale settings, then renders a root
		<code>ThemeProvider</code> around a <code>DefaultsProvider</code>. Neither renders an element.
		Use one <code>UIProvider</code> at the root; inside it, a nested <code>ThemeProvider</code> or
		<code>DefaultsProvider</code> changes the theme or defaults of a section.
	</p>
	<p>
		See <a href={resolve('getting-started/quick-start')}>Quick start</a> for the setup, and
		<a href={resolve('api/theme-provider')}>ThemeProvider</a> for theme scopes.
	</p>
</DocPage>
