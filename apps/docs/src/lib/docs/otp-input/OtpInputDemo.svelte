<script lang="ts">
	// A two-factor sign-in: the code is checked as soon as the last box is filled. 000000 stands
	// for a code the server refused.
	import { OtpInput } from '@sveltier/ui';

	let code = $state('');
	let checked = $state('');
	const refused = $derived(checked === '000000' && code === checked);
</script>

<div class="docs-demo">
	<OtpInput
		label="Verification code"
		name="code"
		hint="Sent to •••• 4821"
		required
		error={refused ? 'This code is not valid. Try again or send a new one.' : undefined}
		oncomplete={(value) => (checked = value)}
		bind:value={code}
	/>
	<p class="docs-dim">
		Bound value: <code>code = {JSON.stringify(code)}</code>{#if checked}, last checked
			<code>{checked}</code>{/if}
	</p>
</div>
