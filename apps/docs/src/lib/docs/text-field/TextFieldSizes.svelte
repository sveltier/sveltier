<script lang="ts">
	// Fields line up with Buttons of the same size and density.
	import { Button, TextField, type Density, type Size } from 'sveltier';

	const ROWS: Array<{ size: Size; density: Density }> = [
		{ size: 'sm', density: 'default' },
		{ size: 'md', density: 'default' },
		{ size: 'lg', density: 'default' },
		{ size: 'md', density: 'compact' }
	];
</script>

<div class="docs-demo">
	{#each ROWS as { size, density } (`${size}-${density}`)}
		<div class="docs-field-row">
			<TextField
				{size}
				{density}
				aria-label="Search, {size} {density}"
				placeholder="Search payees"
			/>
			<Button {size} {density}>{size} · {density}</Button>
		</div>
	{/each}
</div>
