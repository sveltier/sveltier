<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { idsExample } from '#lib/snippets/core.js';
</script>

<DocPage
	title="Building components"
	lede="The conventions every Sveltier component follows. Your own components can follow them too, and then behave like the built-in ones."
>
	<h2 id="props">Shared props and defaults</h2>
	<p>
		A component with a variant, size, density, colour or rounding takes the
		<a href={resolve('core/shared-props')}>shared props</a> with their exact names and values,
		resolves them with <a href={resolve('core/defaults')}>useDefaults</a>, and passes every resolved
		value to
		<code>sharedClasses</code>.
	</p>

	<h2 id="ids">IDs</h2>
	<p>
		Labels, hints and panels are linked by ID. Svelte's <code>$props.id()</code> gives each instance an
		ID that is the same on the server and in the browser, so the links survive hydration.
	</p>
	<Code title="Field.svelte" code={idsExample} />
	<ul>
		<li>The main element takes the <code>id</code> prop when one is passed.</li>
		<li>
			Parts derive from it: <code>&lbrace;id&rbrace;-label</code>,
			<code>&lbrace;id&rbrace;-hint</code>, <code>&lbrace;id&rbrace;-error</code>,
			<code>&lbrace;id&rbrace;-panel</code>.
		</li>
		<li>Reference only parts that render, so screen readers never point at nothing.</li>
		<li>
			Rendering several Svelte roots on one page? Give each its own <code>idPrefix</code> in
			<code>render()</code> and <code>hydrate()</code>.
		</li>
	</ul>
</DocPage>
