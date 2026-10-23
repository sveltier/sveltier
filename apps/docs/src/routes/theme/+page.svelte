<script lang="ts">
	import Sample from '#lib/showcase/Sample.svelte';
	import { PACKS, parseChoice } from '#lib/site.js';
	import { custom, pack as packSnippet, setup, toggle } from '#lib/snippets/theme.js';
	import {
		contrast,
		INTENT_COLORS,
		NEUTRAL_COLORS,
		parseOklch,
		THEME_VARIABLES,
		ThemeProvider,
		useTheme
	} from 'sveltier';

	const theme = useTheme();
	const colors = $derived(theme.current.colors);
	const variables = $derived(theme.current.variables);
	const activePack = $derived(
		PACKS.find((p) => p.id === parseChoice(theme.name).pack) ?? PACKS[0]!
	);
	const samples = [
		{ id: 'setup', title: 'Root layout', code: setup },
		{ id: 'pack', title: 'Pick a theme pack', code: packSnippet },
		{ id: 'custom', title: 'Combine and customise', code: custom },
		{ id: 'toggle', title: 'Read and change the theme', code: toggle }
	];

	function ratio(foreground: string | undefined, background: string | undefined): string {
		const fg = foreground ? parseOklch(foreground) : undefined;
		const bg = background ? parseOklch(background) : undefined;
		return fg && bg ? `${contrast(fg, bg).toFixed(2)}:1` : '–';
	}
</script>

<svelte:head>
	<title>Themes · Sveltier</title>
</svelte:head>

<header class="docs-page-head">
	<span class="docs-label">Foundations</span>
	<h1>Themes</h1>
	<p class="docs-lede">
		Five built-in design languages, each in light and dark. A theme sets far more than colour: type
		families, corner radii, depth, label and button casing, and the speed and easing of motion. All
		ten themes fulfil one typed contract and pass the same WCAG contrast checks, and the right one
		is painted from the first frame, before any JavaScript runs.
	</p>
</header>

<section aria-labelledby="packs-title">
	<div class="docs-section-head">
		<h2 id="packs-title">Five design languages</h2>
		<p>Each tile is a nested <code>ThemeProvider</code>. Apply one to the whole site.</p>
	</div>
	<div class="docs-packs">
		{#each PACKS as pack (pack.id)}
			<ThemeProvider theme="{pack.id}-light" withBackground class="docs-pack">
				<span class="docs-label">{pack.id === 'monolith' ? 'Default' : 'Theme pack'}</span>
				<h3 class="docs-pack__name">{pack.name}</h3>
				<p class="docs-pack__mood">{pack.mood}</p>
				<p class="docs-pack__figure">$248,190<span>.35</span></p>
				<div class="docs-pack__actions">
					{#each ['light', 'dark'] as const as mode (mode)}
						{@const name = `${pack.id}-${mode}`}
						<button
							type="button"
							class="docs-button"
							aria-pressed={theme.choice === name}
							onclick={() => theme.set(name)}
						>
							{mode === 'light' ? 'Light' : 'Dark'}
						</button>
					{/each}
				</div>
			</ThemeProvider>
		{/each}
	</div>
</section>

<section aria-labelledby="showcase-title">
	<div class="docs-section-head">
		<h2 id="showcase-title">{activePack.name} in use</h2>
		<p>{activePack.suits} Everything below is interactive.</p>
	</div>
	<dl class="docs-brief">
		<div>
			<dt class="docs-label">Type</dt>
			<dd>{activePack.type}</dd>
		</div>
		<div>
			<dt class="docs-label">Shape</dt>
			<dd>{activePack.shape}</dd>
		</div>
		<div>
			<dt class="docs-label">Motion</dt>
			<dd>{activePack.motion}</dd>
		</div>
		<div>
			<dt class="docs-label">Fonts</dt>
			<dd><code>pnpm add {activePack.install}</code></dd>
		</div>
	</dl>
	{#key activePack.id}
		<div class="docs-frames">
			{#each ['light', 'dark'] as const as mode (mode)}
				<figure>
					<figcaption class="docs-label">{mode === 'light' ? 'Light' : 'Dark'}</figcaption>
					<ThemeProvider theme="{activePack.id}-{mode}" withBackground class="docs-frame">
						<Sample />
					</ThemeProvider>
				</figure>
			{/each}
		</div>
	{/key}
</section>

<section aria-labelledby="tokens-title">
	<div class="docs-section-head">
		<h2 id="tokens-title">Tokens of {theme.name}</h2>
		<p>
			Live values{#if theme.choice === 'system'}, following your system{/if}. Contrast is measured
			against <code>--sv-color-background</code>.
		</p>
	</div>
	<div class="docs-usage">
		<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="docs-table-scroll" role="region" aria-label="Colour tokens" tabindex="0">
			<table class="docs-tokens">
				<thead>
					<tr>
						<th scope="col">Colour</th>
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
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="docs-table-scroll" role="region" aria-label="Theme contract" tabindex="0">
			<table class="docs-tokens">
				<thead>
					<tr>
						<th scope="col">Contract variable</th>
						<th scope="col">Value</th>
					</tr>
				</thead>
				<tbody>
					{#each THEME_VARIABLES as name (name)}
						<tr>
							<td><code>--sv-{name}</code></td>
							<td><code class="docs-dim">{variables[name]}</code></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<section aria-labelledby="usage-title">
	<div class="docs-section-head">
		<h2 id="usage-title">Usage</h2>
		<p>Install the provider once at the root. Nested providers scope a theme to a subtree.</p>
	</div>
	<div class="docs-usage">
		{#each samples as sample (sample.id)}
			<figure>
				<figcaption class="docs-label" id="usage-{sample.id}">{sample.title}</figcaption>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<pre role="region" aria-labelledby="usage-{sample.id}" tabindex="0"><code
						>{sample.code}</code
					></pre>
			</figure>
		{/each}
	</div>
</section>
