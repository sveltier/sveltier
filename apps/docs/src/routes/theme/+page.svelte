<script lang="ts">
	import { COMBOS } from '#lib/site.js';
	import { custom, setup, toggle } from '#lib/snippets/theme.js';
	import {
		contrast,
		INTENT_COLORS,
		NEUTRAL_COLORS,
		parseOklch,
		ThemeProvider,
		useTheme
	} from 'sveltier';

	const theme = useTheme();
	const colors = $derived(theme.current.colors);

	function ratio(foreground: string | undefined, background: string | undefined): string {
		const fg = foreground ? parseOklch(foreground) : undefined;
		const bg = background ? parseOklch(background) : undefined;
		return fg && bg ? `${contrast(fg, bg).toFixed(2)}:1` : '–';
	}
</script>

<svelte:head>
	<title>Theme · Sveltier</title>
</svelte:head>

<header class="docs-page-head">
	<span class="docs-label">Foundations</span>
	<h1>Theme</h1>
	<p class="docs-lede">
		Two bases, Ink and Bone, and two accents, Champagne and Verdigris. Neutrals share the accent's
		hue, so greys lean warm or cool with it. Every colour is <code>oklch()</code>, every pairing is
		tested for contrast, and the right theme is painted from the first frame, before any JavaScript
		runs.
	</p>
</header>

<section aria-labelledby="combos-title">
	<div class="docs-section-head">
		<h2 id="combos-title">Four combinations</h2>
		<p>Each tile is a nested <code>ThemeProvider</code>. Apply one to the whole site.</p>
	</div>
	<div class="docs-combos">
		{#each COMBOS as combo (combo.name)}
			<ThemeProvider theme={combo.name} withBackground class="docs-combo">
				<div class="docs-combo__top">
					<span class="docs-label">{combo.label}</span>
					<span class="docs-delta docs-delta--up">+1.84%</span>
				</div>
				<p class="docs-combo__figure">
					2,481,906<span class="docs-combo__cents">.35</span>
					<span class="docs-combo__ccy">USD</span>
				</p>
				<dl class="docs-combo__ledger">
					<div>
						<dt>Available</dt>
						<dd>480,000.00</dd>
					</div>
					<div>
						<dt>Unrealised P&amp;L</dt>
						<dd class="docs-up">+162,318.40</dd>
					</div>
					<div>
						<dt>Day change</dt>
						<dd class="docs-down">−4,201.77</dd>
					</div>
				</dl>
				<button
					type="button"
					class="docs-button"
					aria-pressed={theme.choice === combo.name}
					onclick={() => theme.set(combo.name)}
				>
					{theme.choice === combo.name ? 'Applied' : 'Apply to site'}
				</button>
			</ThemeProvider>
		{/each}
	</div>
</section>

<section aria-labelledby="tokens-title">
	<div class="docs-section-head">
		<h2 id="tokens-title">Colour tokens</h2>
		<p>
			Live values of <strong>{theme.name}</strong>
			{#if theme.choice === 'system'}(following your system){/if}. Contrast is measured against
			<code>--sv-color-background</code>.
		</p>
	</div>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-labelledby="tokens-title" tabindex="0">
		<table class="docs-tokens">
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
						<td>
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
</section>

<section aria-labelledby="usage-title">
	<div class="docs-section-head">
		<h2 id="usage-title">Usage</h2>
		<p>Install the provider once at the root. Nested providers scope a theme to a subtree.</p>
	</div>
	<div class="docs-usage">
		<figure>
			<figcaption class="docs-label" id="usage-setup">Root layout</figcaption>
			<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre role="region" aria-labelledby="usage-setup" tabindex="0"><code>{setup}</code></pre>
		</figure>
		<figure>
			<figcaption class="docs-label" id="usage-custom">Accents and custom themes</figcaption>
			<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre role="region" aria-labelledby="usage-custom" tabindex="0"><code>{custom}</code></pre>
		</figure>
		<figure>
			<figcaption class="docs-label" id="usage-toggle">Read and change the theme</figcaption>
			<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre role="region" aria-labelledby="usage-toggle" tabindex="0"><code>{toggle}</code></pre>
		</figure>
	</div>
</section>
