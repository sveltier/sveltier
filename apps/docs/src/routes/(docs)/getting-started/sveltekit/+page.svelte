<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import {
		kitActionPage,
		kitActionServer,
		kitCreate,
		kitLayout,
		kitPage,
		kitTailwind
	} from '#lib/snippets/guides.js';
</script>

<DocPage
	title="SvelteKit"
	lede="Set up Sveltier in a SvelteKit app: the provider in the root layout, fonts, a first page, links and form actions. Pages render on the server in the right theme, with no flash."
>
	<h2 id="create">Create the app</h2>
	<p>
		Start from the official scaffold, then add Sveltier and the fonts of the theme pack you use.
		Monolith uses Geist and Geist Mono; <a href={resolve('getting-started/fonts')}>Fonts</a> lists the
		others.
	</p>
	<Code title="Terminal" lang="sh" code={kitCreate} />
	<p>
		Nothing else to configure: SvelteKit compiles the components from the package like your own, and
		their styles are bundled with the pages that use them.
	</p>

	<h2 id="layout">Add the provider to the root layout</h2>
	<p>
		<code>UIProvider</code> goes around everything, so every page and component finds the theme, the defaults
		and the locale. Import the fonts here too.
	</p>
	<Code title="+layout.svelte" code={kitLayout} />

	<h2 id="page">A first page</h2>
	<p>
		Components are imported from <code>@sveltier/ui</code>. <code>useTheme()</code> works in any component
		under the provider.
	</p>
	<Code title="+page.svelte" code={kitPage} />

	<h2 id="theme">Theme on the server</h2>
	<p>
		The provider writes the theme's CSS and a small script into the page's
		<code>&lt;head&gt;</code>
		during server rendering. The script restores a stored choice before the first paint, so a user who
		picked dark never sees a light frame, on server-rendered and prerendered pages alike. To let the server
		render the user's choice itself, or to add a CSP nonce, see
		<a href={resolve('getting-started/server-rendering')}>Server-side rendering</a>.
	</p>

	<h2 id="links">Links</h2>
	<p>
		A Button with <code>href</code> is an <code>&lt;a&gt;</code>, so SvelteKit's client-side
		navigation and preloading apply to it as to any link. Build the URL with
		<code>resolve()</code> from <code>$app/paths</code>, as in the page above.
	</p>

	<h2 id="forms">Form actions</h2>
	<p>
		<code>Form</code> renders a real <code>&lt;form&gt;</code> and passes <code>method</code> and
		<code>action</code> to it, so form actions work without JavaScript. Attach SvelteKit's
		<code>enhance</code> through <code>fromAction</code> to submit without a reload. Form checks its fields
		first: an invalid form shows its messages, focuses the first invalid field and is not sent.
	</p>
	<Code title="+page.server.ts" lang="ts" code={kitActionServer} />
	<Code title="+page.svelte" code={kitActionPage} />

	<h2 id="tailwind">With Tailwind CSS</h2>
	<p>
		If you added Tailwind (<code>npx sv add tailwindcss</code>), declare the order of the cascade
		layers in <code>src/app.html</code>, before <code>%sveltekit.head%</code>. Without it,
		Tailwind's reset can land above Sveltier's components and strip their backgrounds and padding,
		depending on the order the bundles load in. <a href={resolve('core/styling')}>Styling</a> explains
		the order.
	</p>
	<Code title="app.html" lang="html" code={kitTailwind} />

	<h2 id="next">Next</h2>
	<ul>
		<li><a href={resolve('theme-packs')}>Pick a theme pack</a></li>
		<li><a href={resolve('core/defaults')}>Set defaults for the whole app</a></li>
		<li><a href={resolve('forms/form')}>Form and validation</a></li>
	</ul>
</DocPage>
