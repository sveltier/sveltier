<script lang="ts">
	// Every variant in a few colours: the same six weights in any colour of the theme.
	import { Button, type Color, type Variant } from '@sveltier/ui';

	const VARIANTS: Variant[] = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'];
	const COLORS: Color[] = ['primary', 'neutral', 'success', 'error'];
</script>

<div class="docs-demo">
	<div class="docs-button-grid" role="group" aria-label="Variants and colours">
		{#each VARIANTS as variant (variant)}
			<span class="docs-label">{variant}</span>
			{#each COLORS as color (color)}
				<Button {variant} {color}>{color}</Button>
			{/each}
		{/each}
	</div>
</div>
