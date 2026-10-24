<script lang="ts">
	// A toolbar of icon buttons, each named by aria-label and described by a tooltip, and a
	// longer description below a button.
	import { Button, Tooltip } from '@sveltier/ui';
	import Glyph, { type GlyphName } from '../button/Glyph.svelte';

	const TOOLS: { name: string; text: string; glyph: GlyphName }[] = [
		{ name: 'Copy', text: 'Copy the IBAN', glyph: 'copy' },
		{ name: 'Download', text: 'Download the statement as a PDF', glyph: 'download' },
		{ name: 'Share', text: 'Share a read-only link', glyph: 'share' }
	];
</script>

<div class="docs-demo">
	<div class="docs-actions">
		{#each TOOLS as tool (tool.glyph)}
			<Tooltip text={tool.text}>
				{#snippet trigger(attributes)}
					<Button {...attributes} icon variant="text" aria-label={tool.name}>
						<Glyph name={tool.glyph} />
					</Button>
				{/snippet}
			</Tooltip>
		{/each}
	</div>
	<div class="docs-actions">
		<Tooltip
			text="Blocks new card payments until you unfreeze it. Direct debits and refunds still arrive."
			side="bottom"
		>
			{#snippet trigger(attributes)}
				<Button {...attributes} variant="outlined">Freeze card</Button>
			{/snippet}
		</Tooltip>
	</div>
</div>
