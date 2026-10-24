<script lang="ts">
	// A Menu with every kind of entry, opened from a Button in a themed scope between two plain
	// buttons, with the chosen item and the last close reason shown.
	import Button from '../../lib/components/Button/Button.svelte';
	import Menu from '../../lib/components/Menu/Menu.svelte';
	import type { MenuItem, MenuProps } from '../../lib/components/Menu/types.js';
	import type { CloseReason } from '../../lib/core/overlay/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	const ITEMS: MenuItem[] = [
		{ label: 'Rename', value: 'rename', shortcut: 'F2' },
		{ label: 'Duplicate', value: 'duplicate' },
		{ label: 'Archive', value: 'archive', disabled: true },
		{ heading: 'Export' },
		{ label: 'PDF', value: 'pdf' },
		{ label: 'CSV', value: 'csv' },
		{ separator: true },
		{ label: 'Delete', value: 'delete', danger: true }
	];

	let { open = $bindable(false), ...props }: Partial<MenuProps> = $props();
	let chosen = $state('');
	let reason = $state<CloseReason | ''>('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="padding: 40px 80px">
		<button type="button">Before</button>
		<Menu
			items={ITEMS}
			{...props}
			bind:open
			onselect={(item) => (chosen = item.value ?? '')}
			onclose={(why) => (reason = why)}
		>
			{#snippet trigger(attributes)}<Button {...attributes}>Actions</Button>{/snippet}
		</Menu>
		<button type="button">After</button>
	</div>
	<span data-testid="chosen">{chosen}</span>
	<span data-testid="reason">{reason}</span>
</ThemeProvider>
