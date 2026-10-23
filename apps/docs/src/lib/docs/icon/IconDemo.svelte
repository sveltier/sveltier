<script lang="ts">
	// Path icons at every size and in the theme's colours, inline in text, and labelled.
	import { Icon, type Color, type Size } from 'sveltier';

	// Simple geometric shapes on a 24-unit grid, drawn for these docs.
	const PLUS = 'M11 5h2v14h-2zM5 11h14v2H5z';
	const CHECK = 'M4 12.5 5.5 11l4 4 9-9L20 7.5 9.5 18z';
	const ARROW = 'M4 11h11.2l-4.6-4.6L12 5l7 7-7 7-1.4-1.4 4.6-4.6H4z';
	const CARD = 'M3 6h18v12H3zm2 2v2h14V8zm0 5v3h14v-3zm2 1h4v1H7z';
	const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
	const COLORS: Color[] = ['primary', 'success', 'warning', 'error', 'info'];
</script>

<div class="docs-demo">
	<div class="docs-actions docs-actions--baseline" role="group" aria-label="Sizes">
		{#each SIZES as size (size)}
			<span class="docs-icon-sample"><Icon path={PLUS} {size} /> {size}</span>
		{/each}
	</div>
	<div class="docs-actions docs-actions--baseline" role="group" aria-label="Colours">
		{#each COLORS as color (color)}
			<span class="docs-icon-sample"><Icon path={CHECK} {color} size="lg" /> {color}</span>
		{/each}
	</div>
	<p>
		Transfer <Icon path={ARROW} /> savings: the icon follows the size and colour of this text.
	</p>
	<p>
		<Icon path={CARD} label="Card payment" color="primary" /> Paid with the card ending 4471.
	</p>
</div>
