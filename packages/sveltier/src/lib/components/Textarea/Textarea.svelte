<script lang="ts">
	// Several lines of text in a Field, with validation. See TextareaProps for the props.
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { textConstraintMessage } from '../../core/form/constraints.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import './textarea.css';
	import type { TextareaDefaults, TextareaProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		value = $bindable(''),
		rows = 3,
		autoGrow = false,
		maxRows,
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
	}: TextareaProps = $props();

	const resolve = useDefaults<TextareaDefaults>('Textarea', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();

	const field = createField<string>({
		value: () => value ?? '',
		empty: (text) => text === '',
		check: (text) =>
			textConstraintMessage(
				text,
				{ required, minlength: rest.minlength, maxlength: rest.maxlength },
				locale.t
			),
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) $effect(() => warnUnnamed('Textarea', ref));

	// Browsers without `field-sizing: content` grow the box by measuring the text; CSS caps it
	// at maxRows, past which it scrolls.
	$effect(() => {
		const element = ref;
		void value;
		if (!autoGrow || !element || CSS.supports('field-sizing', 'content')) return;
		element.style.blockSize = 'auto';
		element.style.blockSize = `${element.scrollHeight}px`;
	});

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
	class={['sv-textarea', autoGrow && 'sv-textarea--grow', className]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<textarea
			bind:this={ref}
			{...rest}
			{...attributes}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			{rows}
			style:--sv-textarea-rows={rows}
			style:--sv-textarea-max={maxRows}
			bind:value></textarea>
	{/snippet}
</Field>
