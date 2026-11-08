<script>
	import { Button, Dialog, Icon, TextField, Tooltip } from '@sveltier/ui';
	import { mdiPencil } from '@mdi/js';
</script>

<!-- One control, two overlays: spread both sets of attributes onto it. -->
<Dialog title="Rename the account">
	{#snippet trigger(dialog)}
		<Tooltip text="Rename the account">
			{#snippet trigger(tooltip)}
				<Button {...dialog} {...tooltip} icon variant="text" aria-label="Rename">
					<Icon path={mdiPencil} />
				</Button>
			{/snippet}
		</Tooltip>
	{/snippet}
	<TextField label="Account name" />
</Dialog>
