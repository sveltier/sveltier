<script lang="ts">
	// The design system behind the five languages: golden-ratio scales rendered from the live tokens,
	// and WCAG contrast computed from whichever theme is active.
	import { Button, contrast, parseOklch, useTheme, type Size } from 'sveltier';
	import { PACKS, THEMES } from '../site.js';

	const theme = useTheme();
	const colors = $derived(theme.current.colors);

	const SPACE = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
	const TYPE = [
		['label', 'φ^-¾'],
		['xs', 'φ^-½'],
		['sm', 'φ^-¼'],
		['md', '1'],
		['lg', 'φ^¼'],
		['xl', 'φ^½'],
		['title', 'φ'],
		['headline', 'φ^1.25–1.75'],
		['display', 'φ²–φ³']
	] as const;
	const CONTROLS: ReadonlyArray<readonly [Size, string]> = [
		['xs', 'φ'],
		['sm', 'φ^1.5'],
		['md', 'φ²'],
		['lg', 'φ^2.5'],
		['xl', 'φ³']
	];
	const MOTION = PACKS.map((pack) => {
		const variables = THEMES[`${pack.id}-light`]?.variables;
		return {
			name: pack.name,
			values: [
				variables?.['duration-fast'],
				variables?.['duration-normal'],
				variables?.['duration-slow']
			]
		};
	});

	const pairs = $derived([
		{ label: 'Text on background', fg: colors.text, bg: colors.background, min: 4.5 },
		{ label: 'Muted text on surface', fg: colors['text-muted'], bg: colors.surface, min: 4.5 },
		{
			label: 'Subtle text on background',
			fg: colors['text-subtle'],
			bg: colors.background,
			min: 4.5
		},
		{
			label: 'Control border on background',
			fg: colors['border-strong'],
			bg: colors.background,
			min: 3
		}
	]);

	function ratio(foreground: string, background: string): number | undefined {
		const fg = parseOklch(foreground);
		const bg = parseOklch(background);
		return fg && bg ? contrast(fg, bg) : undefined;
	}
</script>

<section class="landing-section" aria-labelledby="system-title">
	<header class="landing-head">
		<p class="landing-kicker">The design system</p>
		<h2 id="system-title">One design system. Five design languages.</h2>
		<p>
			Material and Bootstrap each give you one look. Sveltier gives you rules: proportion from the
			golden ratio, contrast from WCAG, interaction from the WAI-ARIA patterns. Five complete design
			languages follow them. Every value below is read from the live tokens.
		</p>
	</header>

	<div class="landing-system">
		<figure class="landing-card landing-system__space">
			<figcaption>
				<h3>Spacing: Fibonacci</h3>
				<p>Each step is about φ (1.618) times the last, so the steps look evenly spaced.</p>
			</figcaption>
			<div class="landing-bars" role="img" aria-label="Spacing steps: {SPACE.join(', ')} pixels">
				{#each SPACE as step (step)}
					<span class="landing-bar" style:block-size="var(--sv-space-{step})"><b>{step}</b></span>
				{/each}
			</div>
		</figure>

		<figure class="landing-card landing-system__type">
			<figcaption>
				<h3>Type: powers of φ</h3>
				<p>Body text at 16px; every other size is a power of the golden ratio.</p>
			</figcaption>
			<ul class="landing-ramp">
				{#each TYPE as [name, power] (name)}
					<li>
						<span class="landing-ramp__sample" style:font-size="var(--sv-text-{name})">Ag</span>
						<span class="landing-mono">{name} · {power}</span>
					</li>
				{/each}
			</ul>
		</figure>

		<figure class="landing-card landing-system__controls">
			<figcaption>
				<h3>Controls: φ to φ³</h3>
				<p>Control heights climb by half powers of φ, from 26 to 68 pixels.</p>
			</figcaption>
			<div class="landing-controls">
				{#each CONTROLS as [size, power] (size)}
					<div>
						<Button {size} variant="tonal">{size}</Button>
						<span class="landing-mono">{power}</span>
					</div>
				{/each}
			</div>
		</figure>

		<figure class="landing-card landing-system__motion">
			<figcaption>
				<h3>Motion: Fibonacci milliseconds</h3>
				<p>Fast, normal and slow in each pack. Reduced motion takes them to 0.01ms.</p>
			</figcaption>
			<table class="landing-table">
				<thead>
					<tr
						><th scope="col">Pack</th><th scope="col">Fast</th><th scope="col">Normal</th><th
							scope="col">Slow</th
						></tr
					>
				</thead>
				<tbody>
					{#each MOTION as row (row.name)}
						<tr>
							<th scope="row">{row.name}</th>
							{#each row.values as value, index (index)}<td>{value}</td>{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</figure>

		<figure class="landing-card landing-system__contrast">
			<figcaption>
				<h3>Contrast: WCAG, measured live</h3>
				<p>
					Computed now from the active theme. Switch the theme in the bar above and watch them
					change.
				</p>
			</figcaption>
			<table class="landing-table">
				<thead>
					<tr><th scope="col">Pair</th><th scope="col">Ratio</th><th scope="col">Needs</th></tr>
				</thead>
				<tbody>
					{#each pairs as pair (pair.label)}
						{@const value = ratio(pair.fg, pair.bg)}
						<tr>
							<th scope="row">
								<span class="landing-swatch" style:background={pair.bg} style:color={pair.fg}
									>Aa</span
								>
								{pair.label}
							</th>
							<td>{value ? `${value.toFixed(2)}:1` : '–'}</td>
							<td>{pair.min}:1 {value && value >= pair.min ? '✓' : ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</figure>
	</div>
</section>
