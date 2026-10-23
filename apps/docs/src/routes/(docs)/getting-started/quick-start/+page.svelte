<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { appOptions } from '#lib/snippets/core.js';
	import { pack, setup, toggle, viteSetup } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Quick start"
	lede="Add one provider with the theme pack you use, then read or change the theme and the app's settings from any component."
>
	<h2 id="provider">1. Add the provider</h2>
	<p>
		Put <code>UIProvider</code> in your root layout and pass the theme pack you use. It follows the operating
		system's light or dark preference, with no flash on first paint, and gives every component its defaults,
		breakpoints and locale.
	</p>
	<Code title="SvelteKit" code={setup} />
	<p>Without SvelteKit, wrap the root component instead:</p>
	<Code title="Vite" code={viteSetup} />

	<h2 id="pack">2. Pick a theme pack</h2>
	<p>
		Pass a pack to <code>themes</code>. Its light and dark themes become the pair that "system" and
		<code>toggle()</code> switch between. Only the packs you pass are bundled.
	</p>
	<Code title="Maison" code={pack} />
	<p>
		Each pack names its own fonts; install them as shown in <a
			href={resolve('getting-started/fonts')}>Fonts</a
		>.
	</p>

	<h2 id="use-theme">3. Read and change the theme</h2>
	<p>
		<code>useTheme()</code> returns the nearest theme. Its fields are reactive, and the root remembers
		the user's choice across visits.
	</p>
	<Code title="Theme toggle" code={toggle} />

	<h2 id="options">4. Set app-wide options</h2>
	<p>
		Defaults, locale and breakpoints are options of the same provider. All of them are optional.
	</p>
	<Code title="+layout.svelte" code={appOptions} />

	<h2 id="next">Next</h2>
	<ul>
		<li><a href={resolve('theming')}>How theming works</a></li>
		<li><a href={resolve('theme-packs')}>The five theme packs</a></li>
		<li><a href={resolve('api/ui-provider')}>UIProvider API</a></li>
	</ul>
</DocPage>
