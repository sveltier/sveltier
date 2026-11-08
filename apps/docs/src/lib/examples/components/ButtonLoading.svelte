<script>
	import { Button } from '@sveltier/ui';
	let { invoice } = $props();
	let paying = $state(false);

	async function pay() {
		paying = true;
		try {
			await fetch(`/api/invoices/${invoice.id}/pay`, { method: 'POST' });
		} finally {
			paying = false;
		}
	}
</script>

<!-- Ignores presses while loading, so the invoice is paid once. -->
<Button loading={paying} onclick={pay}>Pay invoice</Button>
