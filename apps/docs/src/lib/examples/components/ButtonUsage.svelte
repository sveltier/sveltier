<script>
	import { Button } from '@sveltier/ui';

	let { onTransfer, onCancel } = $props();
</script>

<Button onclick={onTransfer}>New transfer</Button>
<Button variant="outlined" color="error" onclick={onCancel}>Cancel payment</Button>
