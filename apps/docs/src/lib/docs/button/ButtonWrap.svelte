<script lang="ts">
	// A sentence for a label, in a narrow panel: it wraps and grows from the button's height.
	import { Button } from '@sveltier/ui';
</script>

<div class="docs-demo">
	<div class="docs-button-wrap">
		<Button size="sm" variant="outlined" wrap>
			Add the method's indicators: SMA 20 · SMA 50 · SMA 200
		</Button>
		<Button size="sm" variant="outlined" wrap>Add SMA 20</Button>
	</div>
</div>

<style>
	.docs-button-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--sv-space-8);
		max-inline-size: 15rem;
	}
</style>
