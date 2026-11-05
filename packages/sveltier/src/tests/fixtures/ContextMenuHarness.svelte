<script lang="ts">
	// One ContextMenu on three order rows (buttons) in a themed scope, after a plain button, with
	// the row it opened on, the chosen item and the last close reason shown.
	import ContextMenu from '../../lib/components/ContextMenu/ContextMenu.svelte';
	import type { ContextMenuProps } from '../../lib/components/ContextMenu/types.js';
	import type { MenuItem } from '../../lib/components/Menu/types.js';
	import type { CloseReason } from '../../lib/core/overlay/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	const ITEMS: MenuItem[] = [
		{ label: 'Copy id', value: 'copy' },
		{ label: 'Open chart', value: 'chart' },
		{ separator: true },
		{ label: 'Cancel order', value: 'cancel', danger: true }
	];
	const ORDERS = ['A-1', 'A-2', 'A-3'];

	let { open = $bindable(false), ...props }: Partial<ContextMenuProps> = $props();
	let row = $state('');
	let chosen = $state('');
	let reason = $state<CloseReason | ''>('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="padding: 40px 80px">
		<button type="button">Before</button>
		<ContextMenu
			label="Order actions"
			items={ITEMS}
			{...props}
			bind:open
			onopen={(element) => (row = element.dataset.id ?? '')}
			onselect={(item) => (chosen = `${item.value} ${row}`)}
			onclose={(why) => (reason = why)}
		>
			{#snippet target(attributes)}
				<div style="display: grid; inline-size: 300px">
					{#each ORDERS as order (order)}
						<button type="button" {...attributes} data-id={order} style="padding: 8px">
							Order {order}
						</button>
					{/each}
				</div>
			{/snippet}
		</ContextMenu>
	</div>
	<span data-testid="row">{row}</span>
	<span data-testid="chosen">{chosen}</span>
	<span data-testid="reason">{reason}</span>
</ThemeProvider>
