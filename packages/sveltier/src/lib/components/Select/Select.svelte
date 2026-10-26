<script lang="ts" generics="T extends string | number, I extends SelectItem<T> = SelectItem<T>">
	// One value from a list under the field, as the APG select-only combobox. See SelectProps.
	import type { Attachment } from 'svelte/attachments';
	import { DEV, warnDuplicates, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import Listbox from './Listbox.svelte';
	import { edge, inGroupOrder, moveBy, typeaheadIndex } from './options.js';
	import './select.css';
	import type { SelectDefaults, SelectItem, SelectProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		items,
		value = $bindable(null),
		onchange,
		placeholder,
		option,
		selection,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		readonly = false,
		name,
		prepend,
		append,
		id,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: SelectProps<T, I> = $props();

	const resolve = useDefaults<SelectDefaults>('Select', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();
	const uid = $props.id();
	const controlId = $derived(id ?? uid);
	const listId = $derived(`${controlId}-list`);

	const ordered = $derived(inGroupOrder(items));
	const chosen = $derived(ordered.find((item) => item.value === value));
	const inert = $derived(p.disabled || readonly);
	let open = $state(false);
	let active = $state(-1);

	const field = createField<T | null>({
		value: () => value ?? null,
		empty: (chosenValue) => chosenValue === null,
		check: (chosenValue) => (required && chosenValue === null ? locale.t('required') : undefined),
		// Rules never see an empty value: the check above stops it first.
		rules: () => rules as readonly Rule<T | null>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) {
		$effect(() => warnUnnamed('Select', ref));
		$effect(() =>
			warnDuplicates(
				'Select',
				'items',
				items.map((item) => item.value),
				'Give each item its own value.'
			)
		);
	}

	// The field's box: the list opens under it, at least as wide.
	let box = $state<HTMLElement | null>(null);
	const findBox: Attachment<HTMLElement> = (node) => {
		box = node.closest<HTMLElement>('.sv-field__box');
	};

	const chosenIndex = () => ordered.findIndex((item) => item.value === value);
	// Opening points at the chosen option, else the first one that can be chosen.
	const start = () => {
		const index = chosenIndex();
		return index >= 0 ? index : edge(ordered, 'first');
	};

	function show(at: number) {
		if (inert) return;
		active = at;
		open = true;
	}

	function choose(index: number) {
		const item = ordered[index];
		if (!item || item.disabled) return;
		open = false;
		if (item.value === value) return;
		value = item.value;
		onchange?.(item.value);
		field.changed();
	}

	// Typing jumps to a label, building one search over half a second, as a native list does.
	let search = '';
	let timer: ReturnType<typeof setTimeout> | undefined;
	function type(key: string): boolean {
		clearTimeout(timer);
		timer = setTimeout(() => (search = ''), 500);
		search += key.toLowerCase();
		const index = typeaheadIndex(ordered, search, open ? active : chosenIndex());
		if (index < 0) return false;
		if (open) active = index;
		else show(index);
		return true;
	}

	function keydown(event: KeyboardEvent) {
		if (inert || event.defaultPrevented) return;
		const { key, altKey, ctrlKey, metaKey } = event;
		const moves: Record<string, (() => void) | undefined> = open
			? {
					ArrowDown: () => (active = moveBy(ordered, active, 1)),
					ArrowUp: () => (altKey ? choose(active) : (active = moveBy(ordered, active, -1))),
					PageDown: () => (active = moveBy(ordered, active, 10)),
					PageUp: () => (active = moveBy(ordered, active, -10)),
					Home: () => (active = edge(ordered, 'first')),
					End: () => (active = edge(ordered, 'last')),
					Enter: () => choose(active),
					// A space inside a search is part of it: "new y" finds "New York".
					' ': () => (search ? type(' ') : choose(active))
				}
			: {
					ArrowDown: () => show(start()),
					ArrowUp: () => show(start()),
					Enter: () => show(start()),
					' ': () => show(start()),
					Home: () => show(edge(ordered, 'first')),
					End: () => show(edge(ordered, 'last'))
				};
		const move = moves[key];
		if (move) {
			event.preventDefault();
			move();
		} else if (key === 'Tab' && open) {
			// Tab chooses the option pointed at and moves on, as APG has it.
			if (active >= 0) choose(active);
			open = false;
		} else if (key.length === 1 && !ctrlKey && !metaKey && !altKey && type(key)) {
			event.preventDefault();
		}
	}

	// Leaving means focus went outside the field, not into it.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (root.contains(event.relatedTarget as Node | null)) return;
		open = false;
		field.left();
	}
</script>

{#snippet end()}
	{@render append?.()}
	<svg class="sv-select__caret" viewBox="0 0 24 24" aria-hidden="true"
		><path d="M7 10l5 5 5-5" /></svg
	>
{/snippet}

<Field
	{...p}
	id={controlId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={end}
	class={['sv-select', open && 'sv-select--open', className]}
	{style}
	onfocusout={leave}
>
	{#snippet children({
		required: isRequired,
		disabled: isDisabled,
		readonly: isReadonly,
		...attributes
	})}
		<div
			bind:this={ref}
			{...rest}
			{...attributes}
			class={[attributes.class, 'sv-select__control']}
			role="combobox"
			tabindex={isDisabled ? -1 : 0}
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={open ? listId : undefined}
			aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
			aria-labelledby={label ? `${controlId}-label` : undefined}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			aria-required={isRequired || undefined}
			aria-disabled={isDisabled || undefined}
			aria-readonly={isReadonly || undefined}
			onclick={() => (open ? (open = false) : show(start()))}
			onkeydown={keydown}
			{@attach findBox}
		>
			{#if chosen}
				{#if selection}{@render selection(chosen)}{:else}{chosen.label}{/if}
			{:else}
				<span class="sv-select__placeholder">{placeholder ?? ''}</span>
			{/if}
		</div>
		{#if name}<input type="hidden" {name} value={value ?? ''} />{/if}
	{/snippet}
</Field>

{#if open}
	<Listbox
		id={listId}
		anchor={box}
		items={ordered}
		{active}
		chosen={value ?? null}
		labelledby={label ? `${controlId}-label` : undefined}
		label={rest['aria-label'] as string | undefined}
		{option}
		empty={locale.t('noMatches')}
		onpick={choose}
		onhover={(index) => (active = index)}
		onclose={() => (open = false)}
	/>
{/if}
