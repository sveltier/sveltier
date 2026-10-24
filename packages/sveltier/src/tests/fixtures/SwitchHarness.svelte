<script lang="ts">
	// A Switch in a themed form, with its bound state shown, the submitted form data written out
	// and a reset button.
	import Switch from '../../lib/components/Switch/Switch.svelte';
	import type { SwitchProps } from '../../lib/components/Switch/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		checked = $bindable(false),
		dir,
		...props
	}: SwitchProps & { dir?: 'ltr' | 'rtl' } = $props();
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		{dir}
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<Switch label="Sign in with biometrics" name="biometrics" {...props} bind:checked />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="checked">{checked}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
