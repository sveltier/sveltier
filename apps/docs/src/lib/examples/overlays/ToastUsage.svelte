<script>
	import { Button, useToast } from '@sveltier/ui';

	// While the component initialises; show() whenever something happens.
	const toast = useToast();

	function send() {
		// … send the payment
		toast.show('Payment sent', {
			action: { label: 'Undo', onclick: cancel }
		});
	}

	function cancel() {
		// …
	}
</script>

<Button onclick={send}>Send payment</Button>
<Button variant="outlined" onclick={() => toast.show('Statement saved', { color: 'success' })}>
	Save statement
</Button>
