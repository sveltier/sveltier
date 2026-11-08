<script lang="ts">
	import { OtpInput } from '@sveltier/ui';
	let code = $state('');
	let form: HTMLFormElement;
</script>

<form method="POST" action="?/verify" bind:this={form}>
	<!-- Submits itself once the last box is filled. -->
	<OtpInput
		label="Verification code"
		name="code"
		hint="Sent to •••• 4821"
		required
		oncomplete={() => form.requestSubmit()}
		bind:value={code}
	/>
</form>
