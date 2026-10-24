<script lang="ts">
	// A sign-up form: two text fields and submit and reset buttons, with an extra submit listener
	// added after the form's own, as SvelteKit's enhance adds one. Buttons outside the form call
	// its methods through bind:this.
	import Button from '../../lib/components/Button/Button.svelte';
	import Form from '../../lib/components/Form/Form.svelte';
	import type { FormProps } from '../../lib/components/Form/types.js';
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import type { ValidateOn } from '../../lib/core/form/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		onsubmit,
		onlater,
		validateOn,
		disabled = false,
		emailValidateOn
	}: {
		onsubmit?: FormProps['onsubmit'];
		onlater?: () => void;
		validateOn?: ValidateOn;
		disabled?: boolean;
		emailValidateOn?: ValidateOn;
	} = $props();

	let form: ReturnType<typeof Form> | undefined = $state();
	let name = $state('');
	let email = $state('');
	let validity = $state('');

	// Runs after the form's own submit listener, like an attachment would.
	function later(element: HTMLFormElement) {
		const listener = () => onlater?.();
		element.addEventListener('submit', listener);
		return () => element.removeEventListener('submit', listener);
	}
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Form bind:this={form} {onsubmit} {validateOn} {disabled} {@attach later}>
		<TextField label="Name" name="name" required bind:value={name} />
		<TextField
			label="Email"
			name="email"
			type="email"
			required
			validateOn={emailValidateOn}
			bind:value={email}
		/>
		<Button type="submit">Sign up</Button>
		<Button type="reset" variant="text">Clear</Button>
	</Form>
	<button type="button" onclick={() => (validity = String(form?.validate()))}>Validate</button>
	<button type="button" onclick={() => form?.resetValidation()}>Hide messages</button>
	<span data-testid="validity">{validity}</span>
	<span data-testid="values">{name}|{email}</span>
</ThemeProvider>
