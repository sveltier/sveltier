<script lang="ts">
	// The replay's portfolio card, unchanged, in every theme pack. Each tile can theme the site.
	import { resolve } from '$app/paths';
	import { ThemeProvider, useTheme } from 'sveltier';
	import { PACKS } from '../site.js';
	import Portfolio from './examples/Portfolio.svelte';

	// Captured here, under the root provider; inside a tile useTheme() would see the tile.
	const root = useTheme();
</script>

<section class="landing-section" aria-labelledby="same-title">
	<header class="landing-head">
		<p class="landing-kicker">Five design languages</p>
		<h2 id="same-title">Same code. Five finished looks.</h2>
		<p>
			The portfolio card from the replay, unchanged, in every theme pack: type, shape, colour and
			motion all change, the code does not. Each tile is a nested <code>ThemeProvider</code>; apply
			one to the whole site.
		</p>
	</header>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="landing-packs" role="region" aria-label="Theme packs" tabindex="0">
		{#each PACKS as pack (pack.id)}
			<ThemeProvider theme="{pack.id}-light" withBackground class="landing-pack">
				<div class="landing-pack__head">
					<h3><a href={resolve(`theme-packs/${pack.id}`)}>{pack.name}</a></h3>
					<div class="landing-pack__apply" role="group" aria-label="Apply {pack.name}">
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
				</div>
				<Portfolio />
			</ThemeProvider>
		{/each}
	</div>
</section>
