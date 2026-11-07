<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import {
		classProp,
		kitTailwind,
		layerOrder,
		ownLayers,
		scopedTokens,
		unlayered
	} from '#lib/snippets/guides.js';
</script>

<DocPage
	title="Styling"
	lede="Sveltier's CSS lives in cascade layers, so your own CSS wins without !important. Change the whole app with a theme, a section with tokens, and one component with a class."
>
	<h2 id="layers">Cascade layers</h2>
	<p>Every rule Sveltier ships sits in one of four layers, all inside <code>sv</code>:</p>
	<Code title="Layer order" lang="css" code={layerOrder} />
	<ul>
		<li><code>sv.tokens</code>: the design scale, as custom properties.</li>
		<li>
			<code>sv.base</code>: document defaults, and the classes behind <code>color</code>,
			<code>variant</code>, <code>size</code> and <code>density</code>.
		</li>
		<li><code>sv.components</code>: each component's own styles.</li>
		<li><code>sv.utilities</code>: helpers such as the visually hidden text for screen readers.</li>
	</ul>
	<p>
		CSS outside any layer beats every layer, whatever its specificity. A plain rule in your
		stylesheet is enough:
	</p>
	<Code title="app.css" lang="css" code={unlayered} />

	<h2 id="class">One component: the class prop</h2>
	<p>
		<code>class</code> and other attributes reach the component's root element. In a Svelte
		component, styles are scoped to its own markup, so reach a child component's element through
		<code>:global()</code>, kept inside one of your own classes.
	</p>
	<Code title="Hero.svelte" code={classProp} />

	<h2 id="tokens">A section: tokens</h2>
	<p>
		Spacing, radii, type and colours are custom properties named <code>--sv-*</code>. Set one on a
		container and every component inside follows it.
	</p>
	<Code title="Square.svelte" code={scopedTokens} />
	<p>
		The <a href={resolve('theming/contract')}>theme contract</a> lists the variables a theme sets,
		and the <a href={resolve('theming/scale')}>design scale</a> the sizes and spaces.
	</p>

	<h2 id="theme">The whole app: a theme</h2>
	<p>
		To change colours, radii, fonts or motion everywhere, define a theme over a pack with
		<a href={resolve('theming/custom-themes')}>defineTheme()</a> instead of overriding rules.
	</p>

	<h2 id="own-layers">Your own layers</h2>
	<p>
		If your CSS uses layers too, declare their order once, with <code>sv</code> before yours. Do it in
		the HTML, before any stylesheet: the first time a layer is named fixes its place, and Sveltier's styles
		are bundled with the components that use them, so a declaration inside your stylesheet may come after
		theirs.
	</p>
	<Code title="app.html" lang="html" code={ownLayers} />

	<h2 id="tailwind">Tailwind CSS</h2>
	<p>
		Tailwind 4 uses four layers: <code>theme</code>, <code>base</code> (its reset),
		<code>components</code> and <code>utilities</code>. Put <code>sv</code> after the reset, so it
		does not strip the components' backgrounds and padding, and before the utilities, so a class
		such as <code>px-12</code> on a component wins. In SvelteKit, write it in
		<code>src/app.html</code>; with Vite alone, at the top of <code>index.html</code>.
	</p>
	<Code title="app.html" lang="html" code={kitTailwind} />

	<h2 id="class-names">Class names</h2>
	<p>
		Each component's root element has a class named after it, such as <code>sv-button</code> or
		<code>sv-card</code>. Classes inside a component are part of its implementation and may change
		while the API is in alpha; prefer props, tokens and the <code>class</code> prop.
	</p>
</DocPage>
