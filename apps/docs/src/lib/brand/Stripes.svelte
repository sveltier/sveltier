<script lang="ts">
	// The brand's S stripes, leaning 10° like the symbol. Decorative.
	import { stripes } from './stripes.js';

	const LANES = stripes({ r1: 150, r2: 230, spine: 120, gap: 22, count: 22, reach: 2400 });
</script>

<svg class="brand-stripes" viewBox="-760 -560 1520 1120" aria-hidden="true" focusable="false">
	<g transform="skewX(-10)">
		{#each LANES as d, index (index)}
			<path {d} class="brand-stripes__lane" />
		{/each}
	</g>
</svg>
