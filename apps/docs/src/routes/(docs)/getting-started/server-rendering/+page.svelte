<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { cookie, csp } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Server-side rendering"
	lede="Sveltier is safe to render on the server and paints the right theme from the first frame, before any JavaScript runs."
>
	<h2 id="no-flash">How the theme avoids a flash</h2>
	<ol>
		<li>
			<strong>One stylesheet for every theme.</strong> The root provider writes a
			<code>&lt;style&gt;</code> into <code>&lt;head&gt;</code> with one rule per theme, keyed by
			<code>data-sv-theme</code>.
		</li>
		<li>
			<strong>"System" is pure CSS.</strong> It maps to the light or dark theme with
			<code>prefers-color-scheme</code> media rules, so no script is needed to follow the operating system.
		</li>
		<li>
			<strong>A remembered choice is restored before the body is parsed.</strong> A tiny inline
			script copies it from <code>localStorage</code> onto <code>&lt;html&gt;</code>. Only known
			theme names are accepted.
		</li>
		<li>
			<strong>Hydration never repaints.</strong> The provider reads the stored choice after mount, so
			the first client render matches the server HTML and the colours never change.
		</li>
	</ol>
	<p>
		This is tested in Chromium, Firefox and WebKit by sampling every animation frame from document
		creation through hydration.
	</p>

	<h2 id="ssr-safety">SSR safety</h2>
	<p>
		No module touches <code>window</code> or <code>document</code> at import time, and every component
		has a server rendering test that runs in Node.
	</p>

	<h2 id="server-knows">Letting the server know the choice</h2>
	<p>
		The provider remembers choices in <code>localStorage</code>, which the server cannot read. If
		your server should render theme-dependent markup (for example a toggle that shows the current
		mode), keep the choice in a cookie and pass it as <code>theme</code>:
	</p>
	<Code title="Cookie" code={cookie} />

	<h2 id="csp">Content Security Policy</h2>
	<p>
		The provider writes one inline <code>&lt;style&gt;</code> and, when persistence is on, one
		inline <code>&lt;script&gt;</code>. Pass your per-request nonce, or allow the script by hash:
	</p>
	<Code title="CSP" code={csp} />
	<p>Set <code>storageKey={'{false}'}</code> to drop the script entirely.</p>
</DocPage>
