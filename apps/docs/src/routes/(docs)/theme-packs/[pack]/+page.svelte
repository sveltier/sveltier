<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import Sample from '#lib/showcase/Sample.svelte';
	import { packUsage } from '#lib/snippets/theme.js';
	import { ThemeProvider, useTheme } from 'sveltier';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const pack = $derived(data.pack);
	const root = useTheme();

	const usage = $derived(packUsage(pack.id));
</script>

<DocPage title={pack.name} lede={pack.mood}>
	<div class="docs-actions" role="group" aria-label="Apply {pack.name} to this site">
		{#each ['light', 'dark'] as const as mode (mode)}
			{@const name = `${pack.id}-${mode}`}
			<button
				type="button"
				class="docs-button"
				aria-pressed={root.choice === name}
				onclick={() => root.set(name)}
			>
				Use {pack.name}
				{mode}
			</button>
		{/each}
	</div>

	<h2 id="character">Character</h2>
	<dl class="docs-brief">
		<div>
			<dt class="docs-label">Type</dt>
			<dd>{pack.type}</dd>
		</div>
		<div>
			<dt class="docs-label">Shape</dt>
			<dd>{pack.shape}</dd>
		</div>
		<div>
			<dt class="docs-label">Motion</dt>
			<dd>{pack.motion}</dd>
		</div>
		<div>
			<dt class="docs-label">Suits</dt>
			<dd>{pack.suits}</dd>
		</div>
	</dl>

	<h2 id="install">Install</h2>
	<Code title="Fonts" lang="sh" code={`pnpm add ${pack.install}`} />
	<Code title="Use the pack" code={usage} />

	<h2 id="showcase">Showcase</h2>
	<p>The same sample screen in both themes of the pack. Everything is interactive.</p>
	{#key pack.id}
		<div class="docs-frames">
			{#each ['light', 'dark'] as const as mode (mode)}
				<figure>
					<figcaption class="docs-label">{mode === 'light' ? 'Light' : 'Dark'}</figcaption>
					<ThemeProvider theme="{pack.id}-{mode}" withBackground class="docs-frame">
						<Sample />
					</ThemeProvider>
				</figure>
			{/each}
		</div>
	{/key}
</DocPage>
