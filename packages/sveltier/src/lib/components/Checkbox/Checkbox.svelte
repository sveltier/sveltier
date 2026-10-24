<script lang="ts">
	// A box that is checked or not, with its label beside it and validation. See CheckboxProps.
	import { untrack } from 'svelte';
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import Choice from '../Choice/Choice.svelte';
	import './checkbox.css';
	import type { CheckboxDefaults, CheckboxProps } from './types.js';

	let {
		color,
		size,
		density,
		disabled,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		id,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: CheckboxProps = $props();

	const resolve = useDefaults<CheckboxDefaults>('Checkbox', {
		color: 'primary',
		size: 'md',
		density: 'default',
		disabled: false
	});
	const p = $derived(resolve({ color, size, density, disabled }));
	const locale = useLocale();
	// A form reset goes back to the state the box started in, as it does for a form rendered on
	// the server.
	const initial = untrack(() => checked ?? false);

	const field = createField<boolean>({
		value: () => checked ?? false,
		// Rules run on a checked box only, as they run on a filled field only.
		empty: (on) => !on,
		check: (on) => (!on && required ? locale.t('required') : undefined),
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) $effect(() => warnUnnamed('Checkbox', ref));

	// A toggle is a whole edit, so it also counts as leaving: the message shows at once, even in
	// Safari, where a click does not focus the checkbox.
	function toggled() {
		field.changed();
		field.left();
	}
</script>

<Choice
	{id}
	{label}
	{hint}
	error={field.error}
	{required}
	disabled={p.disabled}
	class={[
		'sv-checkbox',
		sharedClasses(p, 'Checkbox'),
		indeterminate && 'sv-checkbox--indeterminate',
		className
	]}
	{style}
	onchange={toggled}
>
	{#snippet children(attributes)}
		<span class="sv-checkbox__control">
			<input
				bind:this={ref}
				defaultChecked={initial}
				{...rest}
				{...attributes}
				aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
					undefined}
				type="checkbox"
				class="sv-checkbox__input"
				bind:checked
				bind:indeterminate
			/>
			<span class="sv-checkbox__box" aria-hidden="true">
				<svg class="sv-checkbox__mark" viewBox="0 0 24 24" focusable="false">
					<path class="sv-checkbox__check" d="M5 12.5l4.5 4.5 9.5-9.5" />
					<path class="sv-checkbox__dash" d="M6.5 12h11" />
				</svg>
			</span>
		</span>
	{/snippet}
</Choice>
