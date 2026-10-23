<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { CONTRACT_DOCS } from '#lib/docs/contract.js';
	import { contractCss } from '#lib/snippets/theme.js';
	import { THEME_VARIABLES, useTheme } from 'sveltier';

	const theme = useTheme();
	const variables = $derived(theme.current.variables);
</script>

<DocPage
	title="Theme contract"
	lede="Every theme sets the same typed list of variables, so components can take every stylistic decision from the theme and never hard-code a look."
>
	<h2 id="why">Why a contract</h2>
	<p>
		<code>THEME_VARIABLES</code> lists the keys every theme must define, and the
		<code>ThemeDefinition</code> type enforces it: a theme with a missing key does not compile. That keeps
		all five built-in themes interchangeable and tells you exactly what a custom theme can control.
	</p>

	<h2 id="variables">Variables</h2>
	<p>Values are live for <strong>{theme.name}</strong>.</p>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Theme contract variables" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Variable</th>
					<th scope="col">Controls</th>
					<th scope="col">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each THEME_VARIABLES as name (name)}
					<tr>
						<td><code>--sv-{name}</code></td>
						<td>{CONTRACT_DOCS[name]}</td>
						<td><code class="docs-dim docs-break">{variables[name]}</code></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="use">Using the variables</h2>
	<p>Your own components can follow the active theme the same way Sveltier's do:</p>
	<Code title="my-card.css" lang="css" code={contractCss} />

	<h2 id="motion">Motion and reduced motion</h2>
	<p>
		Themes set their own easing and durations. When the user asks for reduced motion, the base
		stylesheet collapses all three durations to near zero from a later cascade layer, so it wins
		over every theme without you doing anything.
	</p>
</DocPage>
