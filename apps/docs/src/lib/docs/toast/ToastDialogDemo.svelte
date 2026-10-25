<script lang="ts">
	// A toast with Undo from inside a dialog: it shows in the dialog, where it can be pressed.
	import { Button, Dialog, TextField, useToast } from '@sveltier/ui';

	const toast = useToast();
	let saved = $state('Acme Ltd');
	let name = $state('Acme Ltd');

	function save() {
		const before = saved;
		saved = name;
		toast.show('Payee saved', {
			action: { label: 'Undo', onclick: () => (saved = name = before) }
		});
	}
</script>

<div class="docs-demo">
	<Dialog title="Edit the payee" size="sm" closable>
		{#snippet trigger(attributes)}
			<Button {...attributes} variant="outlined">Edit payee</Button>
		{/snippet}
		<TextField label="Name" bind:value={name} />
		{#snippet actions()}
			<Button onclick={save}>Save</Button>
		{/snippet}
	</Dialog>
	<p class="docs-dim">Payee: <code>{saved}</code></p>
</div>
