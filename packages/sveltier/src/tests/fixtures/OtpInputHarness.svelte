<script lang="ts">
	// An OtpInput in a themed form, with its bound value shown, what oncomplete got, the
	// submitted form data written out and a reset button.
	import OtpInput from '../../lib/components/OtpInput/OtpInput.svelte';
	import type { OtpInputProps } from '../../lib/components/OtpInput/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(''), ...props }: OtpInputProps = $props();
	let submitted = $state('');
	let completed = $state<string[]>([]);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		style="inline-size: 20rem"
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<OtpInput
			label="Verification code"
			name="code"
			oncomplete={(code) => (completed = [...completed, code])}
			{...props}
			bind:value
		/>
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="value">{value}</span>
	<span data-testid="completed">{completed.join(',')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
