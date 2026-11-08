<script>
	import { Button, Icon, Tooltip } from '@sveltier/ui';
	import { mdiContentCopy } from '@mdi/js';
</script>

<!-- The tooltip describes the button; aria-label still names it. -->
<Tooltip text="Copy the IBAN">
	{#snippet trigger(attributes)}
		<Button {...attributes} icon variant="text" aria-label="Copy"
			><Icon path={mdiContentCopy} /></Button
		>
	{/snippet}
</Tooltip>

<Tooltip text="Blocks new card payments until you unfreeze it." side="bottom">
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Freeze card</Button>
	{/snippet}
</Tooltip>
