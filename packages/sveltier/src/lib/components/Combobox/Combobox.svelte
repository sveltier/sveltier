<script lang="ts" generics="T extends string | number, I extends SelectItem<T> = SelectItem<T>">
	// A value found by typing, as the APG combobox with list autocomplete. See ComboboxProps.
	import type { Attachment } from 'svelte/attachments';
	import { DEV, warnDuplicates, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import Listbox from '../Select/Listbox.svelte';
	import { edge, inGroupOrder, matchesQuery, moveBy, type SelectItem } from '../Select/options.js';
	import '../Select/select.css';
	import type { ComboboxDefaults, ComboboxProps } from './types.js';

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
		query = $bindable(''),
		filter,
		loading = false,
		placeholder,
		option,
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
	}: ComboboxProps<T, I> = $props();

	const resolve = useDefaults<ComboboxDefaults>('Combobox', {
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
	const inputId = $derived(id ?? uid);
	const listId = $derived(`${inputId}-list`);
	const inert = $derived(p.disabled || readonly);

	const ordered = $derived(inGroupOrder(items));
	const chosen = $derived(ordered.find((item) => item.value === value));
	let open = $state(false);
	let active = $state(-1);
	// Whether the user has typed since a value was chosen. Until then the field shows the chosen
	// label and the list every item, not only those matching that label.
	let typed = $state(false);
	const text = $derived(typed ? query : (chosen?.label ?? ''));
	const shown = $derived(
		!typed || filter === false
			? ordered
			: ordered.filter((item) => (filter ?? matchesQuery)(item, query))
	);

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
		$effect(() => warnUnnamed('Combobox', ref));
		$effect(() =>
			warnDuplicates(
				'Combobox',
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

	// Opening points at the chosen option, else the first (or, going up, the last) one.
	function show(end: 'first' | 'last' = 'first') {
		if (inert) return;
		const index = shown.findIndex((item) => item.value === value);
		active = index >= 0 ? index : edge(shown, end);
		open = true;
	}

	function set(next: T | null) {
		if (next === value) return;
		value = next;
		onchange?.(next);
		field.changed();
	}

	function choose(index: number) {
		const item = shown[index];
		if (!item || item.disabled) return;
		open = false;
		typed = false;
		query = '';
		set(item.value);
	}

	// Typing filters the list and points at the first match, so Enter chooses it.
	function input(event: Event & { currentTarget: HTMLInputElement }) {
		typed = true;
		query = event.currentTarget.value;
		active = edge(shown, 'first');
		open = true;
	}

	function keydown(event: KeyboardEvent) {
		if (inert || event.defaultPrevented) return;
		const moves: Record<string, (() => void) | undefined> = {
			ArrowDown: () => (open ? (active = moveBy(shown, active, 1)) : show('first')),
			ArrowUp: () => (open ? (active = moveBy(shown, active, -1)) : show('last')),
			PageDown: open ? () => (active = moveBy(shown, active, 10)) : undefined,
			PageUp: open ? () => (active = moveBy(shown, active, -10)) : undefined,
			// Enter while an input method composes a word (Vietnamese, Japanese) confirms the word.
			Enter:
				open && active >= 0 && !event.isComposing && event.keyCode !== 229
					? () => choose(active)
					: undefined,
			// With the list closed, Escape puts back the chosen label over what was typed.
			Escape:
				!open && typed
					? () => {
							typed = false;
							query = '';
						}
					: undefined
		};
		const move = moves[event.key];
		if (move) {
			event.preventDefault();
			move();
		} else if (event.key === 'Tab') {
			open = false;
		}
	}

	// Leaving puts back the chosen label over what was typed; an emptied field clears the value.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (root.contains(event.relatedTarget as Node | null)) return;
		open = false;
		if (typed && query.trim() === '') set(null);
		typed = false;
		query = '';
		field.left();
	}

	function toggle() {
		if (open) open = false;
		else show();
	}
</script>

{#snippet end()}
	{@render append?.()}
	<!-- A pointer convenience: the keyboard opens the list with the arrows. -->
	<span class="sv-combobox__toggle" aria-hidden="true" onpointerdown={() => !inert && toggle()}>
		<svg class="sv-select__caret" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" /></svg>
	</span>
{/snippet}

<Field
	{...p}
	id={inputId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={end}
	class={['sv-combobox', open && 'sv-select--open', className]}
	{style}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<input
			bind:this={ref}
			{...rest}
			{...attributes}
			type="text"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={open}
			aria-controls={open ? listId : undefined}
			aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			{placeholder}
			value={text}
			oninput={input}
			onkeydown={keydown}
			onclick={() => !inert && toggle()}
			{@attach findBox}
		/>
		{#if name}<input type="hidden" {name} value={value ?? ''} />{/if}
	{/snippet}
</Field>

{#if open}
	<Listbox
		id={listId}
		anchor={box}
		items={shown}
		{active}
		chosen={value ?? null}
		labelledby={label ? `${inputId}-label` : undefined}
		label={rest['aria-label'] as string | undefined}
		{option}
		empty={loading ? locale.t('loading') : locale.t('noMatches')}
		onpick={choose}
		onhover={(index) => (active = index)}
		onclose={() => (open = false)}
	/>
{/if}
