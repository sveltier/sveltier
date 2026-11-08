<script lang="ts">
	import { Button, Menu } from '@sveltier/ui';
	import { mdiDelete, mdiDownload, mdiPencil } from '@mdi/js';

	// The page decides what each item does.
	let { run }: { run: (value?: string) => void } = $props();
</script>

<Menu
	items={[
		{ label: 'Rename', value: 'rename', icon: mdiPencil, shortcut: 'F2' },
		{ label: 'Move to savings', value: 'move', disabled: true },
		{ heading: 'Export' },
		{ label: 'Statement as PDF', value: 'pdf', icon: mdiDownload },
		{ separator: true },
		{ label: 'Close account', value: 'close', icon: mdiDelete, danger: true }
	]}
	onselect={(item) => run(item.value)}
>
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Account actions</Button>
	{/snippet}
</Menu>
