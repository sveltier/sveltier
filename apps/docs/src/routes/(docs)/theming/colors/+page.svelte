<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { tonal } from '#lib/snippets/theme.js';
	import { contrast, INTENT_COLORS, NEUTRAL_COLORS, parseOklch, useTheme } from 'sveltier';

	const theme = useTheme();
	const colors = $derived(theme.current.colors);

	function ratio(foreground: string | undefined, background: string | undefined): string {
		const fg = foreground ? parseOklch(foreground) : undefined;
		const bg = background ? parseOklch(background) : undefined;
		return fg && bg ? `${contrast(fg, bg).toFixed(2)}:1` : '–';
	}
</script>

<DocPage
	title="Colours"
	lede="Colours are roles, not hues. Every value is oklch(), every text pairing is tested for contrast, and price direction is kept apart from status."
>
	<h2 id="roles">Roles</h2>
	<ul>
		<li>
			<strong>Neutrals</strong>: <code>background</code>, <code>surface</code>,
			<code>surface-raised</code>, three borders and three text emphases.
			<code>border-strong</code> marks control boundaries and reaches 3:1; <code>border</code> and
			<code>border-soft</code> are decorative hairlines.
		</li>
		<li>
			<strong>Intents</strong>: <code>primary</code>, <code>success</code>, <code>warning</code>,
			<code>error</code>, <code>info</code>, <code>up</code> and <code>down</code>, each with an
			<code>--sv-on-*</code> colour for text on a filled background.
		</li>
	</ul>

	<h2 id="up-down">Price direction</h2>
	<p>
		<code>up</code> and <code>down</code> are separate from <code>success</code> and
		<code>error</code>, with the same defaults. Some markets show rising prices in red; swap only
		<code>up</code> and <code>down</code> and status colours keep their meaning. Sveltier never shows
		direction by colour alone: deltas always carry a sign or an arrow.
	</p>

	<h2 id="tonal">Tonal fills</h2>
	<p>
		Selected chips, badges and alerts use a light wash of an intent (<code>--sv-tonal-wash</code>)
		with text mixed slightly toward the theme's text colour (<code>--sv-tonal-text-mix</code>),
		which keeps it at 4.5:1 on the wash in every theme.
	</p>
	<Code title="badge.css" lang="css" code={tonal} />

	<h2 id="values">Live values</h2>
	<p>
		<strong>{theme.name}</strong>{#if theme.choice === 'system'}
			(following your system){/if}. Contrast is measured against <code>--sv-color-background</code>.
	</p>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Colour tokens" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col">Value</th>
					<th scope="col" class="docs-num">Contrast</th>
				</tr>
			</thead>
			<tbody>
				{#each [...NEUTRAL_COLORS, ...INTENT_COLORS] as name (name)}
					<tr>
						<td class="docs-token">
							<span class="docs-swatch" style:background={`var(--sv-color-${name})`}></span>
							<code>--sv-color-{name}</code>
						</td>
						<td><code class="docs-dim">{colors[name]}</code></td>
						<td class="docs-num">
							{name.startsWith('surface') || name === 'background'
								? '–'
								: ratio(colors[name], colors.background)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</DocPage>
