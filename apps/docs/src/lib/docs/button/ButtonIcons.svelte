<script lang="ts">
	// Icons before and after the label, and icon buttons, which need a label of their own.
	import { Button } from '@sveltier/ui';
	import Glyph from './Glyph.svelte';
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Button>
			{#snippet prepend()}<Glyph name="plus" />{/snippet}
			New transfer
		</Button>
		<Button variant="tonal">
			Statement
			{#snippet append()}<Glyph name="download" />{/snippet}
		</Button>
		<Button variant="outlined">
			Continue
			{#snippet append()}<Glyph name="arrow" />{/snippet}
		</Button>
	</div>
	<div class="docs-actions">
		<Button icon aria-label="Send"><Glyph name="send" /></Button>
		<Button icon variant="tonal" aria-label="Approve"><Glyph name="check" /></Button>
		<Button icon variant="text" aria-label="Close"><Glyph name="close" /></Button>
		<Button icon variant="outlined" rounded="full" aria-label="Add"><Glyph name="plus" /></Button>
	</div>
</div>
