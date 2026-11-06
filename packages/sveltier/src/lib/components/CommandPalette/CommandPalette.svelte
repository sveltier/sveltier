<script lang="ts" generics="I extends CommandItem = CommandItem">
	// A search box over the app's commands, in a modal dialog. See CommandPaletteProps.
	import { untrack } from 'svelte';
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { pop } from '../../primitives/motion/motion.js';
	import Modal from '../Modal/Modal.svelte';
	import { edge, groupRuns, inGroupOrder, matchesWords, moveBy } from '../Select/options.js';
	import './command-palette.css';
	import { isApple, matchesShortcut } from './shortcut.js';
	import type { CommandItem, CommandPaletteDefaults, CommandPaletteProps } from './types.js';

	let {
		size,
		density,
		rounded,
		label,
		items,
		onselect,
		open = $bindable(false),
		shortcut = 'Mod+K',
		trigger,
		query = $bindable(''),
		filter,
		loading = false,
		placeholder,
		item: itemSnippet,
		onclose,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: CommandPaletteProps<I> = $props();

	const resolve = useDefaults<CommandPaletteDefaults>('CommandPalette', {
		size: 'md',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ size, density, rounded }));
	const locale = useLocale();
	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const listId = $derived(`${id}-list`);

	function matches(command: I, typed: string) {
		const text = [command.label, command.description, ...(command.keywords ?? [])].join(' ');
		return matchesWords(text, typed);
	}

	const shown = $derived.by(() => {
		const ordered = inGroupOrder(items);
		if (filter === false) return ordered;
		const test = filter ?? matches;
		return ordered.filter((command) => test(command, query));
	});
	const runs = $derived(groupRuns(shown));

	// The command Enter runs: the one pointed at, else the first that can run.
	let pointed = $state(-1);
	const active = $derived(
		pointed >= 0 && pointed < shown.length && !shown[pointed]!.disabled
			? pointed
			: edge(shown, 'first')
	);

	let input = $state<HTMLInputElement | null>(null);
	let list = $state<HTMLElement | null>(null);

	// Each opening starts afresh: nothing typed, the first command pointed at.
	$effect(() => {
		if (!open) return;
		untrack(() => {
			query = '';
			pointed = -1;
		});
	});

	// The active command stays in view as the keys move it.
	$effect(() => {
		if (active < 0 || !list) return;
		list.querySelector(`#${CSS.escape(`${listId}-${active}`)}`)?.scrollIntoView({
			block: 'nearest'
		});
	});

	// Where focus goes back to: the element that had it when the shortcut opened the palette,
	// else (null) the trigger, as the modal shell does.
	let returnTo = $state<HTMLElement | null>(null);

	const apple = isApple();
	function global(event: KeyboardEvent) {
		if (!shortcut || event.defaultPrevented || event.repeat) return;
		if (!matchesShortcut(event, shortcut, apple)) return;
		event.preventDefault();
		// Pressed again while it is open, it goes back to what is typed.
		if (open) return input?.select();
		const focused = document.activeElement;
		returnTo = focused instanceof HTMLElement && focused !== document.body ? focused : null;
		open = true;
	}

	function close(reason: CloseReason) {
		if (!open) return;
		open = false;
		onclose?.(reason);
	}

	function run(index: number) {
		const command = shown[index];
		if (!command || command.disabled) return;
		close('action');
		onselect?.(command);
	}

	function typed(event: Event & { currentTarget: HTMLInputElement }) {
		query = event.currentTarget.value;
		pointed = -1;
	}

	function keydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		const moves: Record<string, (() => void) | undefined> = {
			ArrowDown: () => (pointed = moveBy(shown, active, 1)),
			ArrowUp: () => (pointed = moveBy(shown, active, -1)),
			PageDown: () => (pointed = moveBy(shown, active, 10)),
			PageUp: () => (pointed = moveBy(shown, active, -10)),
			// Enter while an input method composes a word (Vietnamese, Japanese) confirms the word.
			Enter:
				active >= 0 && !event.isComposing && event.keyCode !== 229 ? () => run(active) : undefined
		};
		const move = moves[event.key];
		if (!move) return;
		event.preventDefault();
		move();
	}

	const SEARCH =
		'M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3m0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10';
</script>

<svelte:window onkeydown={global} />

{#snippet opener(attributes: TriggerAttributes)}
	{@render trigger?.({
		...attributes,
		onclick: (event) => {
			returnTo = null;
			attributes.onclick?.(event);
		}
	})}
{/snippet}

{#snippet entry(command: I, index: number)}
	<!-- Commands are pressed with the pointer and run with the keys in the search box, which keeps
	     focus and names the active one with aria-activedescendant, so they take no focus. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
	<div
		id="{listId}-{index}"
		role="option"
		aria-selected={index === active}
		aria-disabled={command.disabled || undefined}
		class="sv-command-palette__item"
		onpointerdown={(event) => event.preventDefault()}
		onpointermove={() => !command.disabled && index !== active && (pointed = index)}
		onclick={() => run(index)}
	>
		{#if itemSnippet}
			{@render itemSnippet(command)}
		{:else}
			{#if command.icon}
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
					><path d={command.icon} /></svg
				>
			{/if}
			<span class="sv-command-palette__text">
				<span class="sv-command-palette__label">{command.label}</span>
				{#if command.description}
					<span class="sv-command-palette__description">{command.description}</span>
				{/if}
			</span>
			{#if command.shortcut}<kbd class="sv-command-palette__shortcut">{command.shortcut}</kbd>{/if}
		{/if}
	</div>
{/snippet}

<Modal
	aria-label={label}
	{...rest}
	{id}
	component="CommandPalette"
	placement="center"
	panelClass={['sv-command-palette__panel', sharedClasses(p, 'CommandPalette')]}
	enter={pop}
	class={['sv-command-palette', className]}
	trigger={trigger && opener}
	returnFocus={returnTo}
	{onclose}
	bind:open
	bind:ref
>
	<div class="sv-command-palette__search">
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SEARCH} /></svg>
		<input
			bind:this={input}
			type="text"
			role="combobox"
			aria-label={label}
			aria-autocomplete="list"
			aria-expanded="true"
			aria-controls={shown.length > 0 ? listId : undefined}
			aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			{placeholder}
			value={query}
			oninput={typed}
			onkeydown={keydown}
		/>
	</div>
	{#if shown.length > 0}
		<div
			bind:this={list}
			id={listId}
			role="listbox"
			aria-label={label}
			class="sv-command-palette__list"
		>
			{#each runs as group, g (g)}
				{#if group.group === undefined}
					{#each group.entries as { item, index } (index)}{@render entry(item, index)}{/each}
				{:else}
					<div role="group" aria-labelledby="{listId}-group-{g}">
						<div role="presentation" id="{listId}-group-{g}" class="sv-command-palette__group">
							{group.group}
						</div>
						{#each group.entries as { item, index } (index)}{@render entry(item, index)}{/each}
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div role="status" class="sv-command-palette__empty">
			{loading ? locale.t('loading') : locale.t('noMatches')}
		</div>
	{/if}
</Modal>
