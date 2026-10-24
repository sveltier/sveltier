<script lang="ts" generics="T extends string | number">
	// One choice from a list, as the platform's own select in a Field. See NativeSelectProps.
	import { untrack } from 'svelte';
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import './native-select.css';
	import type { NativeSelectDefaults, NativeSelectProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		options,
		value = $bindable(null),
		placeholder,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		prepend,
		id,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: NativeSelectProps<T> = $props();

	const resolve = useDefaults<NativeSelectDefaults>('NativeSelect', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();

	// The choice a form reset goes back to: the one the select started with.
	const initial = untrack(() => value ?? null);

	const field = createField<T | null>({
		value: () => value ?? null,
		empty: (choice) => choice === null,
		check: (choice) => (choice === null && required ? locale.t('required') : undefined),
		// Rules never see null: an empty choice skips them.
		rules: () => rules as readonly Rule<T | null>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) $effect(() => warnUnnamed('NativeSelect', ref));

	// Leaving means focus went outside the field.
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
	{prepend}
	class={[
		'sv-native-select',
		placeholder !== undefined && value == null && 'sv-native-select--empty',
		className
	]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<select
			bind:this={ref}
			{...rest}
			{...attributes}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			bind:value={() => value ?? '', (next: T | '') => (value = next === '' ? null : next)}
		>
			{#if placeholder !== undefined}
				<option value="" disabled={required} selected={initial === null}>{placeholder}</option>
			{/if}
			{#each options as option (option.value)}
				<option
					value={option.value}
					disabled={option.disabled}
					selected={Object.is(option.value, initial)}>{option.label}</option
				>
			{/each}
		</select>
	{/snippet}
</Field>
