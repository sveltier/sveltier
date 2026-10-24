<script lang="ts">
	// A single line of text in a Field, with validation. See TextFieldProps for the props.
	import { untrack } from 'svelte';
	import { checkValue, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { textConstraintMessage } from '../../core/form/constraints.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import { TEXT_FIELD_TYPES, type TextFieldDefaults, type TextFieldProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		value = $bindable(''),
		type = 'text',
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		readonly = false,
		prepend,
		append,
		id,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: TextFieldProps = $props();

	const resolve = useDefaults<TextFieldDefaults>('TextField', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();
	// A form reset goes back to the text the field started with, as it does for a form rendered on
	// the server. A defaultValue of the app's own wins.
	const initial = untrack(() => value ?? '');

	const field = createField<string>({
		value: () => value ?? '',
		empty: (text) => text === '',
		check: (text) =>
			textConstraintMessage(
				text,
				{
					required,
					type,
					minlength: rest.minlength,
					maxlength: rest.maxlength,
					pattern: rest.pattern
				},
				locale.t
			),
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	// The Field checks the variant; the input's own props are checked here, once it exists.
	if (DEV) {
		$effect(() => {
			checkValue('TextField', 'type', type, TEXT_FIELD_TYPES);
			warnUnnamed('TextField', ref);
		});
	}

	// Leaving means focus went outside the field, not to a button in it.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (!root.contains(event.relatedTarget as Node | null)) field.left();
	}
</script>

<Field
	{...p}
	{id}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	{append}
	class={className}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<input
			bind:this={ref}
			defaultValue={initial}
			{...rest}
			{...attributes}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			{type}
			bind:value
		/>
	{/snippet}
</Field>
