<script lang="ts">
	// Sizes step through the golden scale; density tightens or loosens the same size.
	import { Button, type Density, type Size } from 'sveltier';

	const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
	const DENSITIES: Density[] = ['compact', 'default', 'comfortable'];
</script>

<div class="docs-demo">
	<div class="docs-actions docs-actions--baseline">
		{#each SIZES as size (size)}
			<Button {size}>Size {size}</Button>
		{/each}
	</div>
	<div class="docs-actions docs-actions--baseline">
		{#each DENSITIES as density (density)}
			<Button {density} variant="outlined">{density}</Button>
		{/each}
	</div>
</div>
