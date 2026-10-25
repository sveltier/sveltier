<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SharedPropsDemo from '#lib/docs/SharedPropsDemo.svelte';
	import { customColor, sharedComponent, sharedRegister } from '#lib/snippets/core.js';

	const VARIABLES = [
		{ prop: 'color', sets: ['--sv-color', '--sv-on-color'] },
		{ prop: 'variant', sets: ['--sv-variant-bg', '--sv-variant-fg', '--sv-variant-border'] },
		{ prop: 'size', sets: ['--sv-size-height', '--sv-size-text'] },
		{ prop: 'density', sets: ['--sv-density'] },
		{ prop: 'rounded', sets: ['--sv-rounded'] }
	];
</script>

<DocPage
	title="Shared props"
	lede="Every component that has a variant, size, density, colour or rounding takes the same prop, with the same values and the same meaning."
>
	<h2 id="vocabulary">The vocabulary</h2>
	<ul>
		<li>
			<strong><code>variant</code></strong>: <code>elevated</code> raises the colour as text on a
			surface with the theme's shadow, <code>flat</code> fills with the colour, <code>tonal</code>
			tints with it, <code>outlined</code> draws it as text and border, <code>text</code> as text
			only, and <code>plain</code> is text with no hover or press wash. On a container, such as a
			Card, <code>plain</code> only drops the decoration: the controls inside keep their washes.
		</li>
		<li>
			<strong><code>size</code></strong>: <code>xs</code> to <code>xl</code>. Each step is half a
			step of φ in height and a quarter step in text (<a href={resolve('theming/scale')}
				>Design scale</a
			>).
		</li>
		<li>
			<strong><code>density</code></strong>: <code>compact</code>, <code>default</code> or
			<code>comfortable</code> moves heights and paddings a quarter step of φ, never the text.
		</li>
		<li>
			<strong><code>color</code></strong>: an intent (<code>primary</code>, <code>success</code>,
			<code>warning</code>, <code>error</code>, <code>info</code>, <code>up</code>,
			<code>down</code>), <code>neutral</code>, or a custom colour you register. Any other value is
			a type error.
		</li>
		<li>
			<strong><code>rounded</code></strong>: <code>true</code> keeps the component's own radius,
			<code>false</code> or <code>none</code> squares it, <code>sm</code>–<code>xl</code> pick a
			theme radius and <code>full</code> makes a pill in every theme.
		</li>
	</ul>
	<p>
		Set them once for a subtree with <a href={resolve('core/defaults')}>Defaults</a>. Every value
		follows the active theme, so switch the theme or pack in the top bar and the preview below
		restyles.
	</p>

	<h2 id="preview">Preview</h2>
	<SharedPropsDemo />

	<h2 id="variables">How it works</h2>
	<p>
		Each prop becomes a class, and each class only sets custom properties. The component decides
		where they apply, so one meaning works for a filled button, an outlined field and a tinted chip.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Shared props variables" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Prop</th>
					<th scope="col">Sets</th>
				</tr>
			</thead>
			<tbody>
				{#each VARIABLES as row (row.prop)}
					<tr>
						<td><code>{row.prop}</code></td>
						<td>
							{#each row.sets as variable, index (variable)}{#if index > 0},
								{/if}<code>{variable}</code>{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Hover and press mix <code>--sv-variant-fg</code> over <code>--sv-variant-bg</code> by
		<code>--sv-state-hover</code> (8%) and <code>--sv-state-press</code> (13%). The classes live in
		the <code>sv.base</code> layer, so a component can refine a value and your own unlayered CSS always
		wins.
	</p>

	<h2 id="custom-colors">Custom colours</h2>
	<p>
		Add the colour to your themes with <code>defineTheme</code>, then register its name. The theme
		stylesheet adds its <code>sv-color-brand</code> class, so it works like an intent, server-rendered
		and without inline styles.
	</p>
	<Code title="themes.ts and app.d.ts" lang="ts" code={customColor} />

	<h2 id="your-components">Your own components</h2>
	<p>
		<code>sharedClasses</code> is public, so your components can join the same system. Pass every shared
		prop the component has, defaults included: the variables inherit, and a missing class would let a
		nested component pick up its parent's value. For the same reason, only read the variables of props
		your component has.
	</p>
	<Code title="app.d.ts" lang="ts" code={sharedRegister} />
	<Code title="Pill.svelte" code={sharedComponent} />
	<p>See <a href={resolve('api/shared-classes')}>sharedClasses</a> for the full API.</p>
</DocPage>
