<script lang="ts">
	// Buttons that show toasts through useToast(): a plain one, one with Undo, an error, and the
	// same with Undo from inside a Dialog. The number of undos is shown.
	import Button from '../../lib/components/Button/Button.svelte';
	import Dialog from '../../lib/components/Dialog/Dialog.svelte';
	import { useToast } from '../../lib/core/toast/toast.svelte.js';

	let { duration }: { duration?: number } = $props();

	const toast = useToast();
	let saved = 0;
	let last = $state('');
	let undone = $state(0);
	const undo = { label: 'Undo', onclick: () => undone++ };
</script>

<Button onclick={() => (last = toast.show(`Saved ${++saved}`, { duration }))}>Save</Button>
<Button onclick={() => toast.show('Payment sent', { duration, action: undo })}>Send</Button>
<Button onclick={() => toast.show('Payment failed', { duration, color: 'error' })}>Fail</Button>
<Button onclick={() => toast.dismiss(last)}>Dismiss</Button>
<Dialog title="Transfer">
	{#snippet trigger(attributes)}<Button {...attributes}>Transfer</Button>{/snippet}
	<Button onclick={() => toast.show('Transfer saved', { duration, action: undo })}>
		Save transfer
	</Button>
</Dialog>
<span data-testid="undone">{undone}</span>
