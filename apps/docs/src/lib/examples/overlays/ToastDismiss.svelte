<script>
	import { Button, useToast } from '@sveltier/ui';

	const toast = useToast();

	async function exportTransactions() {
		// Stays until it is closed, or until the export is ready.
		const id = toast.show('Preparing your export…', { duration: 0 });
		await new Promise((done) => setTimeout(done, 3000)); // … the export
		toast.dismiss(id);
		toast.show('Export ready', { color: 'success' });
	}
</script>

<Button variant="outlined" onclick={exportTransactions}>Export transactions</Button>
