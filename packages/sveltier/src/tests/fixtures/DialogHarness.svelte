<script lang="ts">
	// A Dialog opened from a Button, with a field and two actions, the open state and the last
	// close reason shown, and a nested dialog to test the layer stack.
	import Button from '../../lib/components/Button/Button.svelte';
	import Dialog from '../../lib/components/Dialog/Dialog.svelte';
	import type { DialogCloseReason, DialogProps } from '../../lib/components/Dialog/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { open = $bindable(false), ...props }: Omit<DialogProps, 'title'> & { title?: string } =
		$props();
	let reason = $state<DialogCloseReason | ''>('');
	let nested = $state(false);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="block-size: 200vh">
		<Dialog title="Rename the account" {...props} bind:open onclose={(why) => (reason = why)}>
			{#snippet trigger(attributes)}<Button {...attributes}>Rename</Button>{/snippet}
			<label>Name <input name="name" /></label>
			<Dialog title="Are you sure?" bind:open={nested}>
				{#snippet trigger(attributes)}<Button {...attributes}>Check</Button>{/snippet}
				Inner dialog.
			</Dialog>
			{#snippet actions({ close })}
				<Button variant="text" onclick={close}>Cancel</Button>
				<Button>Save</Button>
			{/snippet}
		</Dialog>
	</div>
	<span data-testid="open">{open}</span>
	<span data-testid="reason">{reason}</span>
</ThemeProvider>
