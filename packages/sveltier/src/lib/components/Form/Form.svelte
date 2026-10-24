<script lang="ts">
	// A form that checks its fields on submit. See FormProps for the props.
	import { flushSync } from 'svelte';
	import DefaultsProvider from '../../core/defaults/DefaultsProvider.svelte';
	import type { DefaultsConfig } from '../../core/defaults/context.js';
	import { setFormContext, type FormField } from '../../core/form/context.js';
	import './form.css';
	import type { FormProps } from './types.js';

	let {
		validateOn,
		disabled = false,
		onsubmit,
		onreset,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: FormProps = $props();

	// A registry, not state: nothing renders from it, so a plain Set rather than a SvelteSet.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- never read reactively
	const fields = new Set<FormField>();
	setFormContext({
		get validateOn() {
			return validateOn;
		},
		register(field) {
			fields.add(field);
			return () => fields.delete(field);
		}
	});

	// Always rendered, so turning `disabled` on and off never remounts the fields.
	const defaults: DefaultsConfig = $derived(disabled ? { global: { disabled: true } } : {});

	/** Shows the message of every field. Returns `true` when every field is valid. */
	export function validate(): boolean {
		let valid = true;
		for (const field of fields) if (!field.validate()) valid = false;
		return valid;
	}

	/** Resets the values to their `defaultValue` and hides every message. */
	export function reset(): void {
		ref?.reset();
	}

	/** Hides every message and keeps the values. */
	export function resetValidation(): void {
		for (const field of fields) field.resetValidation();
	}

	function submit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		const invalid = [...fields].filter((field) => !field.validate());
		if (invalid.length === 0) {
			onsubmit?.(event);
			return;
		}
		// Stop here, including listeners added later such as SvelteKit's enhance, which would
		// otherwise send the form anyway.
		event.preventDefault();
		event.stopImmediatePropagation();
		// Focus the first invalid control in document order, once its message is in the DOM, so
		// its label and error are read out together.
		flushSync();
		const controls = invalid
			.map((field) => field.control())
			.filter((control): control is HTMLElement => control != null);
		controls.sort((a, b) =>
			a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
		);
		controls[0]?.focus();
	}

	function afterReset(event: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		resetValidation();
		(onreset as ((event: Event) => void) | null | undefined)?.(event);
	}
</script>

<form
	bind:this={ref}
	{...rest}
	novalidate
	class={['sv-form', className]}
	onsubmit={submit}
	onreset={afterReset}
>
	<DefaultsProvider {defaults}>
		{@render children?.()}
	</DefaultsProvider>
</form>
