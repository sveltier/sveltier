<script>
	import { Button, Icon, Menu, Tooltip } from '@sveltier/ui';
	import { mdiDotsHorizontal } from '@mdi/js';

	let { items, onselect } = $props();
</script>

<!-- One icon button: a tooltip that names its purpose, and the menu it opens. -->
<Tooltip text="More actions">
	{#snippet trigger(tooltip)}
		<Menu {items} {onselect} align="end">
			{#snippet trigger(menu)}
				<Button {...tooltip} {...menu} icon variant="text" aria-label="More">
					<Icon path={mdiDotsHorizontal} />
				</Button>
			{/snippet}
		</Menu>
	{/snippet}
</Tooltip>
