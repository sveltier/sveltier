<script>
	import { Switch } from '@sveltier/ui';
	let notifications = $state(true);
</script>

<Switch
	label="Payment notifications"
	hint="Money in and out, as it happens"
	bind:checked={notifications}
/>
