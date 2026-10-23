<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { bindTheme, nested, severalPacks } from '#lib/snippets/theme.js';
	import { ThemeProvider } from 'sveltier';
</script>

<DocPage
	title="Theming"
	lede="A theme sets colour, type, shape, depth and motion. Register themes once at the root, scope them anywhere below, and let users choose."
>
	<h2 id="what">What a theme is</h2>
	<p>A theme is a plain object with three parts:</p>
	<ul>
		<li><code>dark</code>: whether it is a dark theme.</li>
		<li>
			<code>colors</code>: the colour roles (<a href={resolve('theming/colors')}>Colours</a>), each
			an <code>oklch()</code> value, emitted as <code>--sv-color-*</code> and
			<code>--sv-on-*</code>.
		</li>
		<li>
			<code>variables</code>: the <a href={resolve('theming/contract')}>theme contract</a>: type
			families, radii, casing, depth and motion, emitted as <code>--sv-*</code>.
		</li>
	</ul>
	<p>
		Because shape and motion are part of the theme, switching from Monolith to Maison changes corner
		radii, fonts, button casing and the pace of animations as well as colour.
	</p>

	<h2 id="register">Registering themes</h2>
	<p>
		The root provider (<code>UIProvider</code>, or <code>ThemeProvider</code> on its own) registers
		themes with <code>themes</code> and writes one stylesheet for all of them. There is no implicit default,
		so an app ships only the packs it registers. Combine packs by spreading them:
	</p>
	<Code title="Several packs" code={severalPacks} />

	<h2 id="choice">The user's choice</h2>
	<p>
		<code>theme</code> is either a theme name or <code>"system"</code>, which follows the operating
		system between the <code>light</code> and <code>dark</code> themes. The root provider remembers
		the choice and restores it before first paint (see
		<a href={resolve('getting-started/server-rendering')}>server-side rendering</a>). The prop is
		bindable:
	</p>
	<Code title="bind:theme" code={bindTheme} />

	<h2 id="nested">Nested themes</h2>
	<p>
		A provider inside another one scopes a theme to its subtree. It inherits the registered themes,
		renders a wrapper element (<code>display: contents</code> unless <code>withBackground</code>)
		and never touches <code>&lt;html&gt;</code>.
	</p>
	<Code title="Nested provider" code={nested} />
	<div class="docs-demo">
		<p>This page follows your choice.</p>
		<ThemeProvider theme="monolith-dark" withBackground class="docs-demo__nested">
			<p>This block is always Monolith dark.</p>
		</ThemeProvider>
		<ThemeProvider theme="heritage-light" withBackground class="docs-demo__nested">
			<p>This one is always Heritage light, fonts and corners included.</p>
		</ThemeProvider>
	</div>

	<h2 id="layers">Cascade layers</h2>
	<p>
		All Sveltier CSS lives in four layers: <code>sv.tokens</code>, <code>sv.base</code>,
		<code>sv.components</code> and <code>sv.utilities</code>. Unlayered CSS beats every layer, so
		your overrides never need <code>!important</code> or higher specificity.
	</p>
</DocPage>
