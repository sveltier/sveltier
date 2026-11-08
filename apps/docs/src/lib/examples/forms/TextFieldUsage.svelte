<script>
	import { TextField } from '@sveltier/ui';
	let email = $state('');
</script>

<TextField
	label="Email"
	type="email"
	name="email"
	autocomplete="email"
	hint="Receipts go to this address"
	required
	bind:value={email}
/>
