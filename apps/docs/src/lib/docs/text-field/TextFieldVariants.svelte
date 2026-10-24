<script lang="ts">
	// The five ways to draw a field, from a full border to nothing at all.
	import { TextField, type FieldVariant } from '@sveltier/ui';

	const VARIANTS: FieldVariant[] = ['outlined', 'tonal', 'elevated', 'text', 'plain'];
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		{#each VARIANTS as variant (variant)}
			<TextField {variant} label={variant} placeholder="Company name" />
		{/each}
	</div>
</div>
