<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import {
		defaultsComponent,
		defaultsGlobal,
		defaultsNested,
		defaultsRegister
	} from '#lib/snippets/core.js';
</script>

<DocPage
	title="Defaults"
	lede="Set props once for a whole subtree instead of on every component: globally, per component, and nested where a section needs something different."
>
	<h2 id="resolution">How a prop resolves</h2>
	<p>For every defaultable prop, a component takes the first value that is set:</p>
	<ol>
		<li>the prop passed to the component;</li>
		<li>the nearest <code>DefaultsProvider</code>'s defaults for that component;</li>
		<li>that provider's <code>global</code> defaults;</li>
		<li>the component's built-in value.</li>
	</ol>
	<p>
		<code>undefined</code> and <code>null</code> count as "not set". Every step is reactive:
		changing a prop or a provider's <code>defaults</code> updates the components below it.
	</p>

	<h2 id="global">Global defaults</h2>
	<p>
		<code>global</code> takes the shared props <code>variant</code>, <code>density</code>,
		<code>size</code>, <code>color</code>, <code>rounded</code> and <code>disabled</code>. A global
		default only reaches components that have the prop, so it never adds an attribute to an element
		that does not expect it.
	</p>
	<Code title="+layout.svelte" code={defaultsGlobal} />

	<h2 id="nesting">Nesting</h2>
	<p>
		Providers nest. An inner provider is merged over its parent key by key, so it only needs the
		values it changes.
	</p>
	<Code title="Nested providers" code={defaultsNested} />

	<h2 id="your-components">Your own components</h2>
	<p>
		The same mechanism is public. Register your component's defaults by declaration merging, so
		<code>DefaultsConfig</code> type-checks its key and values:
	</p>
	<Code title="app.d.ts" lang="ts" code={defaultsRegister} />
	<p>
		Then resolve its props with <code>useDefaults</code>. Destructure the defaultable props without
		fallbacks and resolve them in <code>$derived</code>: a fallback in the destructuring would hide
		the provider's value, and on older Svelte 5 releases it is not reactive at all.
	</p>
	<Code title="PriceTag.svelte" code={defaultsComponent} />
	<p>
		See <a href={resolve('api/defaults-provider')}>DefaultsProvider</a> and
		<a href={resolve('api/use-defaults')}>useDefaults</a> for the full API.
	</p>
</DocPage>
