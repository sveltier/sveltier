<script lang="ts">
	// A control beside its label, with a hint or an error under them: the layout Checkbox and
	// Switch share. See ChoiceProps.
	import './choice.css';
	import type { ChoiceProps } from './types.js';

	let {
		id: idProp,
		label,
		hint,
		error = false,
		required = false,
		disabled = false,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ChoiceProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const message = $derived(typeof error === 'string' ? error : undefined);
</script>

<div
	bind:this={ref}
	{...rest}
	class={[
		'sv-choice',
		error !== false && 'sv-choice--invalid',
		disabled && 'sv-choice--disabled',
		className
	]}
>
	<!-- The label wraps the control, so a press anywhere on it toggles the control. -->
	<label class="sv-choice__row">
		{@render children({
			id,
			'aria-describedby': message ? `${id}-error` : hint ? `${id}-hint` : undefined,
			'aria-invalid': error !== false || undefined,
			required,
			disabled
		})}
		{#if label}
			<span class="sv-choice__label"
				>{#if typeof label === 'string'}{label}{:else}{@render label()}{/if}{#if required}<span
						class="sv-choice__required"
						aria-hidden="true">*</span
					>{/if}</span
			>
		{/if}
	</label>
	<div class="sv-choice__messages">
		{#if hint && !message}<p class="sv-choice__hint" id="{id}-hint">{hint}</p>{/if}
		<!-- Announces an error that appears after the user has moved on. -->
		<div aria-live="polite">
			{#if message}<p class="sv-choice__error" id="{id}-error">{message}</p>{/if}
		</div>
	</div>
</div>
