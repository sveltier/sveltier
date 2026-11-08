<script>
	import { Button, Dialog } from '@sveltier/ui';

	function remove() {
		// …
	}
</script>

<Dialog title="Delete this card?" size="sm">
	{#snippet trigger(attributes)}
		<Button {...attributes} color="error" variant="tonal">Delete card</Button>
	{/snippet}

	The card stops working at once. Payments already made stay on your statement.

	{#snippet actions({ close })}
		<Button variant="text" onclick={close}>Keep it</Button>
		<Button
			color="error"
			onclick={() => {
				remove();
				close();
			}}>Delete</Button
		>
	{/snippet}
</Dialog>
