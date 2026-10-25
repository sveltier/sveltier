<script lang="ts">
	// An account's actions: icons, a shortcut, a disabled item, a named group and a destructive
	// action; and the same menu from an icon button that also has a tooltip.
	import { Button, Icon, Menu, Tooltip, type MenuItem } from '@sveltier/ui';

	// Simple geometric shapes on a 24-unit grid, drawn for these docs.
	const RENAME = 'M4 17 14 7l3 3L7 20H4zM15.5 5.5 17 4l3 3-1.5 1.5z';
	const COPY = 'M8 8h12v12H8zm2 2v8h8v-8zM4 4h12v2H6v10H4z';
	const DOWNLOAD = 'M11 4h2v9l3.3-3.3 1.4 1.4-5.7 5.7-5.7-5.7 1.4-1.4L11 13zM5 18h14v2H5z';
	const DELETE = 'M9 3h6v2h5v2H4V5h5zM6 8h12l-1 13H7z';
	const MOVE = 'M4 11h11.2l-4.6-4.6L12 5l7 7-7 7-1.4-1.4 4.6-4.6H4z';
	const MORE =
		'M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z';

	const ITEMS: MenuItem[] = [
		{ label: 'Rename', value: 'rename', icon: RENAME, shortcut: 'F2' },
		{ label: 'Duplicate', value: 'duplicate', icon: COPY },
		{ label: 'Move to savings', value: 'move', icon: MOVE, disabled: true },
		{ heading: 'Export' },
		{ label: 'Statement as PDF', value: 'pdf', icon: DOWNLOAD },
		{ label: 'Transactions as CSV', value: 'csv', icon: DOWNLOAD },
		{ separator: true },
		{ label: 'Close account', value: 'close', icon: DELETE, danger: true }
	];

	let chosen = $state('');
</script>

<div class="docs-demo">
	<div class="docs-actions docs-actions--baseline">
		<Menu items={ITEMS} onselect={(item) => (chosen = item.value ?? '')}>
			{#snippet trigger(attributes)}
				<Button {...attributes} variant="outlined">Account actions</Button>
			{/snippet}
		</Menu>
		<Tooltip text="More actions">
			{#snippet trigger(tooltip)}
				<Menu items={ITEMS} align="end" onselect={(item) => (chosen = item.value ?? '')}>
					{#snippet trigger(menu)}
						<Button {...tooltip} {...menu} icon variant="text" aria-label="More">
							<Icon path={MORE} />
						</Button>
					{/snippet}
				</Menu>
			{/snippet}
		</Tooltip>
	</div>
	<p class="docs-dim">Chosen: <code>{JSON.stringify(chosen)}</code></p>
</div>
