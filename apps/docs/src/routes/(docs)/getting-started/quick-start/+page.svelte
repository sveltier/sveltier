<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { pack, setup, toggle, viteSetup } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Quick start"
	lede="Install the provider once, pick a theme pack, and read or change the theme from any component."
>
	<h2 id="provider">1. Add the provider</h2>
	<p>
		Put <code>ThemeProvider</code> in your root layout. With no props it uses Monolith and follows the
		operating system's light or dark preference, with no flash on first paint.
	</p>
	<Code title="SvelteKit" code={setup} />
	<p>Without SvelteKit, wrap the root component instead:</p>
	<Code title="Vite" code={viteSetup} />

	<h2 id="pack">2. Pick a theme pack</h2>
	<p>
		Pass a pack to <code>themes</code>. Its light and dark themes become the pair that "system" and
		<code>toggle()</code> switch between.
	</p>
	<Code title="Maison" code={pack} />
	<p>
		Each pack names its own fonts; install them as shown in <a
			href={resolve('getting-started/fonts')}>Fonts</a
		>.
	</p>

	<h2 id="use-theme">3. Read and change the theme</h2>
	<p>
		<code>useTheme()</code> returns the nearest provider. Its fields are reactive, and the root provider
		remembers the user's choice across visits.
	</p>
	<Code title="Theme toggle" code={toggle} />

	<h2 id="next">Next</h2>
	<ul>
		<li><a href={resolve('theming')}>How theming works</a></li>
		<li><a href={resolve('theme-packs')}>The five theme packs</a></li>
		<li><a href={resolve('api/theme-provider')}>ThemeProvider API</a></li>
	</ul>
</DocPage>
