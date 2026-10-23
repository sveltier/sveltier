<script lang="ts">
	// The five packs as nested ThemeProviders, each able to theme the whole site.
	import { resolve } from '$app/paths';
	import { ThemeProvider, useTheme } from 'sveltier';
	import { PACKS } from '../site.js';

	// Captured here, under the root provider; inside a tile useTheme() would see the tile.
	const root = useTheme();
</script>

<div class="docs-packs">
	{#each PACKS as pack (pack.id)}
		<ThemeProvider theme="{pack.id}-light" withBackground class="docs-pack">
			<span class="docs-label">{pack.id === 'monolith' ? 'Recommended' : 'Theme pack'}</span>
			<h3 class="docs-pack__name">
				<a href={resolve(`theme-packs/${pack.id}`)}>{pack.name}</a>
			</h3>
			<p class="docs-pack__mood">{pack.mood}</p>
			<p class="docs-pack__figure">$248,190<span>.35</span></p>
			<div class="docs-pack__actions" role="group" aria-label="Apply {pack.name}">
				{#each ['light', 'dark'] as const as mode (mode)}
					{@const name = `${pack.id}-${mode}`}
					<button
						type="button"
						class="docs-button"
						aria-pressed={root.choice === name}
						onclick={() => root.set(name)}
					>
						{mode === 'light' ? 'Light' : 'Dark'}
					</button>
				{/each}
			</div>
		</ThemeProvider>
	{/each}
</div>
