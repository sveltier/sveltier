<script>
	import { Alert, Button } from '@sveltier/ui';
</script>

<Alert type="error" title="Payment declined">
	The card ending 4471 was declined by the issuer.
	{#snippet actions()}
		<Button size="sm" variant="tonal" color="error">Try another card</Button>
	{/snippet}
</Alert>

<Alert type="success" closable>Transfer sent.</Alert>
