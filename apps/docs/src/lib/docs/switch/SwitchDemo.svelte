<script lang="ts">
	// Account settings that apply at once: two switches and one that waits on verification.
	import { Switch } from 'sveltier';

	let notifications = $state(true);
	let biometrics = $state(false);
	let roundUps = $state(false);
</script>

<div class="docs-demo">
	<div class="docs-choices">
		<Switch
			label="Payment notifications"
			hint="Money in and out, as it happens"
			bind:checked={notifications}
		/>
		<Switch label="Sign in with biometrics" bind:checked={biometrics} />
		<Switch
			label="Round up card payments"
			hint="Available once your account is verified"
			disabled
			bind:checked={roundUps}
		/>
	</div>
	<p class="docs-dim">
		Bound values: <code>notifications = {JSON.stringify(notifications)}</code>,
		<code>biometrics = {JSON.stringify(biometrics)}</code>
	</p>
</div>
