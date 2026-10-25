<script lang="ts">
	// Toasts about what just happened: a payment with Undo, a saved statement, a declined card
	// with Retry, and an export that stays until it is ready.
	import { Button, useToast } from '@sveltier/ui';

	const toast = useToast();
	let sent = $state(0);

	function send() {
		sent++;
		toast.show('Payment of €120.00 sent', {
			action: {
				label: 'Undo',
				onclick: () => {
					sent--;
					toast.show('Payment cancelled');
				}
			}
		});
	}

	function decline() {
		toast.show('The bank declined the card', {
			color: 'error',
			action: { label: 'Retry', onclick: send }
		});
	}

	async function exportTransactions() {
		const id = toast.show('Preparing your export…', { duration: 0 });
		await new Promise((done) => setTimeout(done, 3000));
		toast.dismiss(id);
		toast.show('Export ready', { color: 'success' });
	}
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Button onclick={send}>Send payment</Button>
		<Button variant="outlined" onclick={() => toast.show('Statement saved', { color: 'success' })}>
			Save statement
		</Button>
		<Button variant="outlined" color="error" onclick={decline}>Pay by card</Button>
		<Button variant="text" onclick={exportTransactions}>Export transactions</Button>
	</div>
	<p class="docs-dim">Payments sent: <code>{sent}</code></p>
</div>
