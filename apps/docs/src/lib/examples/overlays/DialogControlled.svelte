<script>
	import { Dialog, TextField } from '@sveltier/ui';

	let open = $state(false);
	let name = $state('');
	let closedBy = $state('');
</script>

<!-- Opened from code: no trigger, only bind:open. -->
<Dialog title="Rename the account" closable bind:open onclose={(reason) => (closedBy = reason)}>
	<TextField label="Account name" autofocus bind:value={name} />
</Dialog>

{#if closedBy}<p>Closed by {closedBy}.</p>{/if}
