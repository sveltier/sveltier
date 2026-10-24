<script lang="ts">
	// A setting that is on or off, with its label beside it and validation. See SwitchProps.
	import { untrack } from 'svelte';
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import Choice from '../Choice/Choice.svelte';
	import './switch.css';
	import type { SwitchDefaults, SwitchProps } from './types.js';

	let {
		color,
		size,
		density,
		disabled,
		checked = $bindable(false),
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
	}: SwitchProps = $props();

	const resolve = useDefaults<SwitchDefaults>('Switch', {
		color: 'primary',
		size: 'md',
		density: 'default',
		disabled: false
	});
	const p = $derived(resolve({ color, size, density, disabled }));
	const locale = useLocale();
	// A form reset goes back to the state the switch started in.
	const initial = untrack(() => checked ?? false);

	const field = createField<boolean>({
		value: () => checked ?? false,
		// Rules run on a switch that is on only, as they run on a filled field only.
		empty: (on) => !on,
		check: (on) => (!on && required ? locale.t('required') : undefined),
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) $effect(() => warnUnnamed('Switch', ref));

	// A toggle is a whole edit, so it also counts as leaving: the message shows at once, even in
	// Safari, where a click does not focus the input.
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
	class={['sv-switch', sharedClasses(p, 'Switch'), className]}
	{style}
	onchange={toggled}
>
	{#snippet children(attributes)}
		<span class="sv-switch__control">
			<input
				bind:this={ref}
				defaultChecked={initial}
				{...rest}
				{...attributes}
				aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
					undefined}
				type="checkbox"
				role="switch"
				class="sv-switch__input"
				bind:checked
			/>
			<span class="sv-switch__track" aria-hidden="true"><span class="sv-switch__thumb"></span></span
			>
		</span>
	{/snippet}
</Choice>
