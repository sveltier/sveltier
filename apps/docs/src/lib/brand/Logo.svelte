<script lang="ts">
	// The Sveltier logo: the symbol and, optionally, the drawn wordmark. Decorative: the link or
	// heading around it carries the name. The wordmark ink follows the text colour.
	import { SYMBOL, WORDMARK } from './paths.js';

	let { wordmark = true }: { wordmark?: boolean } = $props();
</script>

<span class="brand-logo">
	<svg class="brand-logo__mark" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
		<path class="brand-logo__bottom" d={SYMBOL.bottom} />
		<path class="brand-logo__top" d={SYMBOL.top} />
	</svg>
	{#if wordmark}
		<svg class="brand-logo__word" viewBox={WORDMARK.viewBox} aria-hidden="true" focusable="false">
			<path class="brand-logo__ink" d={WORDMARK.ink} />
			<path class="brand-logo__dot" d={WORDMARK.dot} />
		</svg>
	{/if}
</span>
