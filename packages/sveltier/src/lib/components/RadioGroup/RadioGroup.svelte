<script lang="ts" generics="T extends string | number">
	// One choice among a few options, as native radios in a fieldset. See RadioGroupProps.
	import { untrack } from 'svelte';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../Choice/choice.css';
	import './radio-group.css';
	import type { RadioGroupDefaults, RadioGroupProps } from './types.js';

	let {
		color,
		size,
		density,
		disabled,
		options,
		value = $bindable(null),
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		inline = false,
		name,
		'aria-describedby': describedBy,
		class: className,
		ref = $bindable(null),
		...rest
	}: RadioGroupProps<T> = $props();

	const uid = $props.id();
	const resolve = useDefaults<RadioGroupDefaults>('RadioGroup', {
		color: 'primary',
		size: 'md',
		density: 'default',
		disabled: false
	});
	const p = $derived(resolve({ color, size, density, disabled }));
	const locale = useLocale();
	// The choice a form reset goes back to: the one the group started with.
	const initial = untrack(() => value ?? null);

	const field = createField<T | null>({
		value: () => value ?? null,
		empty: (choice) => choice === null,
		check: (choice) => (choice === null && required ? locale.t('required') : undefined),
		// Rules never see null: an empty choice skips them.
		rules: () => rules as readonly Rule<T | null>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		// The first radio that can be chosen carries the group's validity and takes focus.
		control: () => ref?.querySelector<HTMLInputElement>('input:not(:disabled)')
	});

	const message = $derived(typeof field.error === 'string' ? field.error : undefined);
	const groupDescription = $derived(
		[describedBy, message ? `${uid}-error` : hint ? `${uid}-hint` : undefined]
			.filter(Boolean)
			.join(' ') || undefined
	);

	// A choice is a whole edit, so it also counts as leaving: the message shows at once.
	function chose() {
		field.changed();
		field.left();
	}

	// A form reset puts the radios back as they started, which bind:group does not notice, so the
	// bound value follows here.
	$effect(() => {
		const form = ref?.form;
		if (!form) return;
		const reset = () => (value = initial);
		form.addEventListener('reset', reset);
		return () => form.removeEventListener('reset', reset);
	});
</script>

<!-- A radiogroup, so the invalid and required states are announced with the group. -->
<fieldset
	bind:this={ref}
	aria-labelledby={label ? `${uid}-legend` : undefined}
	{...rest}
	class={[
		'sv-choice',
		'sv-radio-group',
		sharedClasses(p, 'RadioGroup'),
		inline && 'sv-radio-group--inline',
		field.error !== false && 'sv-choice--invalid',
		className
	]}
	role="radiogroup"
	disabled={p.disabled}
	aria-describedby={groupDescription}
	aria-invalid={field.error !== false || undefined}
	aria-required={required || undefined}
	onchange={chose}
>
	{#if label}
		<legend class="sv-radio-group__legend" id="{uid}-legend"
			>{label}{#if required}<span class="sv-choice__required" aria-hidden="true">*</span
				>{/if}</legend
		>
	{/if}
	<div class="sv-radio-group__options">
		{#each options as option, index (option.value)}
			{@const hintId = option.hint ? `${uid}-${index}-hint` : undefined}
			<div
				class={[
					'sv-radio-group__option',
					(option.disabled || p.disabled) && 'sv-radio-group__option--disabled'
				]}
			>
				<label class="sv-choice__row">
					<span class="sv-radio__control">
						<input
							type="radio"
							class="sv-radio__input"
							name={name ?? uid}
							value={option.value}
							defaultChecked={Object.is(option.value, initial)}
							disabled={option.disabled}
							{required}
							aria-describedby={hintId}
							bind:group={value}
						/>
						<span class="sv-radio__circle" aria-hidden="true"></span>
					</span>
					<span class="sv-choice__label">{option.label}</span>
				</label>
				{#if option.hint}
					<div class="sv-choice__messages">
						<p class="sv-choice__hint" id={hintId}>{option.hint}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="sv-radio-group__messages">
		{#if hint && !message}<p class="sv-choice__hint" id="{uid}-hint">{hint}</p>{/if}
		<!-- Announces an error that appears after the user has moved on. -->
		<div aria-live="polite">
			{#if message}<p class="sv-choice__error" id="{uid}-error">{message}</p>{/if}
		</div>
	</div>
</fieldset>
