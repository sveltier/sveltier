<script lang="ts">
	// Theming, kept short: the replay's card in one theme pack at a time, and a button that gives
	// the whole site that pack. The card's code never changes.
	import { SegmentedControl, ThemeProvider, useTheme } from 'sveltier';
	import { PACKS, type PackId } from '../site.js';
	import Portfolio from './examples/Portfolio.svelte';

	// Captured here, under the root provider; inside the preview useTheme() would see the preview.
	const root = useTheme();
	const options = PACKS.map((item) => ({ value: item.id, label: item.name }));

	let pack = $state<PackId>('maison');
	const name = $derived(PACKS.find((item) => item.id === pack)?.name ?? pack);
</script>

<section class="landing-section" aria-labelledby="theming-title">
	<header class="landing-head">
		<p class="landing-kicker">Theming</p>
		<h2 id="theming-title">Change the look, keep the code</h2>
		<p>
			Sveltier ships with five theme packs. Switch the pack at the root, and every component changes
			its type, shape, colour and motion, while the code your agent wrote stays the same.
		</p>
	</header>
	<div class="landing-theming">
		<div class="landing-theming__controls">
			<div class="landing-scroll">
				<SegmentedControl {options} bind:value={pack} size="sm" aria-label="Theme pack" />
			</div>
			<button type="button" class="docs-button" onclick={() => root.set(`${pack}-light`)}>
				Use {name} on this site
			</button>
		</div>
		<ThemeProvider theme="{pack}-light" withBackground class="landing-pack">
			<Portfolio />
		</ThemeProvider>
	</div>
</section>
