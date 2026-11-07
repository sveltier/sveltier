<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import {
		viteApp,
		viteCreate,
		viteHtml,
		viteMain,
		viteTailwind,
		viteToggle
	} from '#lib/snippets/guides.js';
</script>

<DocPage
	title="Vite"
	lede="Use Sveltier in a single-page app built with Vite and Svelte, without SvelteKit: mount the root component inside the provider and the rest works as in any Svelte app."
>
	<h2 id="create">Create the app</h2>
	<p>Start from Vite's Svelte template, then add Sveltier and the fonts of your theme pack.</p>
	<Code title="Terminal" lang="sh" code={viteCreate} />

	<h2 id="template-styles">Remove the template's styles</h2>
	<p>
		The template's <code>src/app.css</code> styles the page, headings and buttons for its demo.
		Those rules are unlayered, so they win over Sveltier's; delete the file and its import in
		<code>src/main.ts</code>, along with the demo components in <code>src/lib</code>.
	</p>

	<h2 id="mount">Mount the app</h2>
	<p>Import the fonts where the app starts.</p>
	<Code title="main.ts" lang="ts" code={viteMain} />

	<h2 id="provider">Wrap the root component</h2>
	<p>
		<code>UIProvider</code> goes around the whole app. Components that read the theme with
		<code>useTheme()</code> must sit inside it, so they are children of the root component rather than
		the root itself.
	</p>
	<Code title="App.svelte" code={viteApp} />
	<Code title="ThemeToggle.svelte" code={viteToggle} />

	<h2 id="first-paint">The first paint</h2>
	<p>
		Without a server, the page is empty until the JavaScript runs. Sveltier sets the theme while the
		app mounts, so the first frame with content is already in the right theme, including a choice
		stored by an earlier visit. Tell the browser the page supports both schemes so the empty page
		before it follows the system too:
	</p>
	<Code title="index.html" lang="html" code={viteHtml} />
	<p>
		If content must be visible before the JavaScript runs, render on the server with
		<a href={resolve('getting-started/sveltekit')}>SvelteKit</a>.
	</p>

	<h2 id="tailwind">With Tailwind CSS</h2>
	<p>
		Declare the order of the cascade layers at the top of <code>index.html</code>, so Tailwind's
		reset stays under Sveltier's components and its utilities stay above them.
		<a href={resolve('core/styling')}>Styling</a> explains why.
	</p>
	<Code title="index.html" lang="html" code={viteTailwind} />
</DocPage>
