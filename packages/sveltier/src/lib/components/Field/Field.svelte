<script lang="ts">
	// A label, a box for a control, and its hint or error. See FieldProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { readError } from '../../core/form/field.svelte.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './field.css';
	import type { FieldDefaults, FieldProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		id: idProp,
		label,
		hint,
		error,
		required = false,
		readonly = false,
		prepend,
		append,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: FieldProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const resolve = useDefaults<FieldDefaults>('Field', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const shown = $derived(readError(error));
	const message = $derived(typeof shown === 'string' ? shown : undefined);

	// A press anywhere in the box focuses the control, as a press on the label does, except on
	// something that takes focus itself (the control, a button in `append`).
	const FOCUSABLE = 'input, textarea, select, button, a[href], [tabindex]';

	function press(event: PointerEvent) {
		const box = event.currentTarget as HTMLElement;
		const hit = (event.target as Element).closest(FOCUSABLE);
		const control = box.querySelector<HTMLElement>('.sv-field__control');
		if ((hit && box.contains(hit)) || !control || p.disabled) return;
		event.preventDefault();
		control.focus();
	}
</script>

<div
	bind:this={ref}
	{...rest}
	class={[
		'sv-field',
		sharedClasses(p),
		shown !== false && 'sv-field--invalid',
		p.disabled && 'sv-field--disabled',
		readonly && 'sv-field--readonly',
		className
	]}
>
	{#if label}
		<label class="sv-field__label" for={id} id="{id}-label"
			>{label}{#if required}<span class="sv-field__required" aria-hidden="true">*</span>{/if}</label
		>
	{/if}
	<!-- The label and the control are the accessible targets; this only widens the pointer target. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sv-field__box" onpointerdown={press}>
		{#if prepend}<span class="sv-field__prepend">{@render prepend()}</span>{/if}
		{@render children({
			id,
			class: 'sv-field__control',
			'aria-describedby': message ? `${id}-error` : hint ? `${id}-hint` : undefined,
			'aria-invalid': shown !== false || undefined,
			required,
			disabled: p.disabled,
			readonly
		})}
		{#if append}<span class="sv-field__append">{@render append()}</span>{/if}
	</div>
	{#if hint && !message}<p class="sv-field__hint" id="{id}-hint">{hint}</p>{/if}
	<!-- Announces an error that appears after the user has moved on. -->
	<div class="sv-field__alert" aria-live="polite">
		{#if message}<p class="sv-field__error" id="{id}-error">{message}</p>{/if}
	</div>
</div>
