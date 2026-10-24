<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { PACKS, THEMES } from '#lib/site.js';
	import { goldenSplit } from '#lib/snippets/theme.js';
	import type { ThemeVariable } from '@sveltier/ui';

	const PHI = (1 + Math.sqrt(5)) / 2;

	/** φ^power as rem, and as px at the default 16px root. */
	const size = (power: number): string =>
		`${+(PHI ** power).toFixed(4)}rem · ${+(PHI ** power * 16).toFixed(1)}px`;

	const TYPE = [
		{ token: 'label', power: -0.75, step: '−¾' },
		{ token: 'xs', power: -0.5, step: '−½' },
		{ token: 'sm', power: -0.25, step: '−¼' },
		{ token: 'md', power: 0, step: '0' },
		{ token: 'lg', power: 0.25, step: '¼' },
		{ token: 'xl', power: 0.5, step: '½' },
		{ token: 'title', power: 1, step: '1' }
	];

	const FLUID = [
		{ token: 'headline', from: 1.25, to: 1.75, step: '1¼ – 1¾' },
		{ token: 'display', from: 2, to: 3, step: '2 – 3' }
	];

	const LEADING = [
		{ token: 'tight', power: 0.25, step: '¼', use: 'Headings and controls' },
		{ token: 'snug', power: 0.5, step: '½', use: 'Titles and tables' },
		{ token: 'normal', power: 1, step: '1', use: 'Body text' }
	];

	const SPACE = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

	const CONTROLS = [
		{ token: 'xs', power: 1, step: '1' },
		{ token: 'sm', power: 1.5, step: '1½' },
		{ token: 'md', power: 2, step: '2' },
		{ token: 'lg', power: 2.5, step: '2½' },
		{ token: 'xl', power: 3, step: '3' }
	];

	const packs = PACKS.map((pack) => {
		const theme = THEMES[`${pack.id}-light`];
		if (!theme) throw new Error(`[docs] The ${pack.id}-light theme is not registered.`);
		const pick = (names: ThemeVariable[]) =>
			names
				.map((name) => String(theme.variables[name]))
				.map((value) => (value === '999px' ? 'pill' : value))
				.join(' · ');
		return {
			name: pack.name,
			radii: pick(['radius-sm', 'radius-md', 'radius-lg', 'radius-xl']),
			durations: pick(['duration-fast', 'duration-normal', 'duration-slow'])
		};
	});
</script>

<DocPage
	title="Design scale"
	lede="Every size in Sveltier comes from the golden ratio, φ ≈ 1.618. Type and control sizes are powers of φ; spacing, corner radii and durations are Fibonacci numbers."
>
	<h2 id="golden-ratio">The golden ratio</h2>
	<p>
		Each step of a scale is a fixed power of φ larger than the one before, so values taken from
		different scales still relate to each other: a title is φ times the body text, and a medium
		control is φ² rem tall. Fibonacci numbers (2, 3, 5, 8, 13, 21, …) are the whole-number form of
		the same ratio: each is the sum of the two before it, and neighbours approach φ.
	</p>
	<p>
		Sizes are in <code>rem</code>, so they follow the reader's font-size setting. Pick from the
		tokens instead of writing raw values and your own components stay on the same scale.
	</p>

	<h2 id="type">Type</h2>
	<p>Font sizes are quarter steps of φ from 1rem. Headline and display grow with the viewport.</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Type scale" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col" class="docs-num">Size</th>
					<th scope="col" class="docs-num">φ step</th>
					<th scope="col">Specimen</th>
				</tr>
			</thead>
			<tbody>
				{#each TYPE as row (row.token)}
					<tr>
						<td><code>--sv-text-{row.token}</code></td>
						<td class="docs-num">{size(row.power)}</td>
						<td class="docs-num">{row.step}</td>
						<td>
							<span class="docs-scale-type" style:font-size={`var(--sv-text-${row.token})`}>
								Total balance
							</span>
						</td>
					</tr>
				{/each}
				{#each FLUID as row (row.token)}
					<tr>
						<td><code>--sv-text-{row.token}</code></td>
						<td class="docs-num">
							{+(PHI ** row.from).toFixed(4)} – {+(PHI ** row.to).toFixed(4)}rem
						</td>
						<td class="docs-num">{row.step}</td>
						<td>
							<span class="docs-scale-type" style:font-size={`var(--sv-text-${row.token})`}>
								Balance
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="line-height">Line height</h2>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Line heights" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col" class="docs-num">Value</th>
					<th scope="col" class="docs-num">φ step</th>
					<th scope="col">Use</th>
				</tr>
			</thead>
			<tbody>
				{#each LEADING as row (row.token)}
					<tr>
						<td><code>--sv-leading-{row.token}</code></td>
						<td class="docs-num">{+(PHI ** row.power).toFixed(4)}</td>
						<td class="docs-num">{row.step}</td>
						<td>{row.use}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="spacing">Spacing</h2>
	<p>
		Spacing follows the Fibonacci sequence. The suffix is the size in pixels at the default 16px
		root, so <code>--sv-space-21</code> is 21px.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Spacing scale" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col" class="docs-num">Size</th>
					<th scope="col"><span class="docs-visually-hidden">Specimen</span></th>
				</tr>
			</thead>
			<tbody>
				{#each SPACE as px (px)}
					<tr>
						<td><code>--sv-space-{px}</code></td>
						<td class="docs-num">{px / 16}rem</td>
						<td>
							<span
								class="docs-scale-bar"
								style:inline-size={`var(--sv-space-${px})`}
								aria-hidden="true"
							></span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="controls">Controls and density</h2>
	<p>
		Control heights are half steps of φ; <code>md</code>, φ² ≈ 42px, is the default. Density moves a
		control a quarter step: <code>--sv-density-compact</code> is φ<sup>−¼</sup> ≈ 0.887 and
		<code>--sv-density-comfortable</code> is φ<sup>¼</sup> ≈ 1.128.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Control heights" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col" class="docs-num">Height</th>
					<th scope="col" class="docs-num">φ step</th>
					<th scope="col"><span class="docs-visually-hidden">Specimen</span></th>
				</tr>
			</thead>
			<tbody>
				{#each CONTROLS as row (row.token)}
					<tr>
						<td><code>--sv-control-{row.token}</code></td>
						<td class="docs-num">{size(row.power)}</td>
						<td class="docs-num">{row.step}</td>
						<td>
							<span
								class="docs-scale-control"
								style:--docs-height={`var(--sv-control-${row.token})`}
								aria-hidden="true"
							></span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="packs">Theme packs</h2>
	<p>
		Each pack picks its corner radii and durations from the Fibonacci sequence. Maison's square
		corners and Milano's pill-shaped controls are the two exceptions by design.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Pack radii and durations" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Pack</th>
					<th scope="col">Radius sm · md · lg · xl</th>
					<th scope="col">Duration fast · normal · slow</th>
				</tr>
			</thead>
			<tbody>
				{#each packs as pack (pack.name)}
					<tr>
						<td>{pack.name}</td>
						<td class="docs-tabular">{pack.radii}</td>
						<td class="docs-tabular">{pack.durations}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="layout">Layout</h2>
	<p>
		Two-column layouts split 61.8% / 38.2%. Grid tracks of <code>1.618fr</code> and
		<code>1fr</code> share the free space after the gap; <code>--sv-golden-major</code> and
		<code>--sv-golden-minor</code> give the same split as percentages.
	</p>
	<Code title="split.css" lang="css" code={goldenSplit} />
</DocPage>
