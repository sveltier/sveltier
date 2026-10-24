<script lang="ts">
	// A confirmation before a destructive action, and a field in a dialog that focuses it first.
	import { Button, Dialog, TextField } from '@sveltier/ui';

	let name = $state('Everyday account');
	let deleted = $state(false);
</script>

<div class="docs-demo">
	<div class="docs-actions">
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
						deleted = true;
						close();
					}}>Delete</Button
				>
			{/snippet}
		</Dialog>
		<Dialog title="Rename the account" closable>
			{#snippet trigger(attributes)}<Button {...attributes} variant="outlined">Rename</Button
				>{/snippet}
			<TextField label="Account name" autofocus bind:value={name} />
			{#snippet actions({ close })}<Button onclick={close}>Done</Button>{/snippet}
		</Dialog>
	</div>
	<p class="docs-dim">
		Bound values: <code>name = {JSON.stringify(name)}</code>,
		<code>deleted = {JSON.stringify(deleted)}</code>
	</p>
</div>
