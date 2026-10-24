<script lang="ts">
	// The four types, a closable alert that can come back, and an alert with an action.
	import { Alert, Button } from '@sveltier/ui';

	let open = $state(true);
</script>

<div class="docs-demo">
	<Alert type="info">Statements for September are ready to download.</Alert>
	<Alert type="success" title="Transfer sent">$1,250.00 is on its way to Alex Morgan.</Alert>
	<Alert type="warning" variant="outlined">Your card expires next month.</Alert>
	<Alert type="error" title="Payment declined">
		The card ending 4471 was declined by the issuer.
		{#snippet actions()}
			<Button size="sm" color="error" variant="tonal">Try another card</Button>
		{/snippet}
	</Alert>
	<Alert bind:open closable closeLabel="Dismiss tip" variant="elevated" color="neutral">
		Tip: press <kbd>/</kbd> to search your transactions.
	</Alert>
	{#if !open}
		<div class="docs-actions">
			<Button size="sm" variant="text" onclick={() => (open = true)}>Show the tip again</Button>
		</div>
	{/if}
</div>
