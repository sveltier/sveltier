<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { checkContrast, defineCustom, extendPack, override } from '#lib/snippets/theme.js';
</script>

<DocPage
	title="Custom themes"
	lede="defineTheme() builds a complete theme from the parts you change. Everything else comes from a base theme, and readable on- colours are computed for you."
>
	<h2 id="define">Define a theme</h2>
	<p>
		Pass only what differs, and the theme you extend as the second argument. Missing colours and
		contract variables come from it.
	</p>
	<Code title="brand.ts" lang="ts" code={defineCustom} />
	<ul>
		<li>
			Every overridden or added colour gets an <code>on-</code> colour: a deep ink or a near-white
			tinted with its hue, whichever contrasts more. Pass <code>'on-primary'</code> yourself to override
			it.
		</li>
		<li>
			Custom colours (like <code>brand</code> above) become <code>--sv-color-brand</code> and
			<code>--sv-on-brand</code>.
		</li>
		<li>Extra variables are emitted as <code>--sv-&lt;name&gt;</code> too.</li>
	</ul>

	<h2 id="extend">Extend a theme pack</h2>
	<p>Any pack, or any theme you defined, can be the base:</p>
	<Code title="Aurora, teal" lang="ts" code={extendPack} />

	<h2 id="contrast">Check contrast</h2>
	<p>
		Built-in themes pass a WCAG contrast suite. Your colours are yours to check; the same helpers
		are exported:
	</p>
	<Code title="contrast()" lang="ts" code={checkContrast} />

	<h2 id="css">Override with CSS</h2>
	<p>
		For one-off changes you do not need a theme at all. Library CSS lives in cascade layers, so
		plain CSS wins:
	</p>
	<Code title="app.css" lang="css" code={override} />

	<p>
		See the <a href={resolve('theming/contract')}>theme contract</a> for every variable a theme can
		set, and the <a href={resolve('api/define-theme')}>defineTheme API</a>.
	</p>
</DocPage>
