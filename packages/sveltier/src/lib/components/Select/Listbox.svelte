<script lang="ts" generics="T extends string | number, I extends SelectItem<T> = SelectItem<T>">
	// The popup list of a Select or a Combobox: options in groups, in the top layer, placed under
	// the field. Focus stays on the field; `active` is the option it points at.
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { anchored } from '../../primitives/anchored/anchored.js';
	import { dismissable, type DismissReason } from '../../primitives/layer/dismissable.js';
	import { pop } from '../../primitives/motion/motion.js';
	import type { SelectItem } from './options.js';

	let {
		id,
		anchor,
		items,
		active,
		chosen,
		labelledby,
		label,
		option,
		empty,
		onpick,
		onhover,
		onclose
	}: {
		id: string;
		/** The field's box: the list is placed under it, at least as wide. */
		anchor: HTMLElement | null;
		/** The options shown, in the order shown. */
		items: readonly I[];
		active: number;
		chosen: T | null;
		labelledby?: string;
		label?: string;
		option?: Snippet<[item: I]>;
		/** What shows in place of options when there are none. */
		empty: string;
		onpick: (index: number) => void;
		onhover: (index: number) => void;
		onclose: (reason: DismissReason) => void;
	} = $props();

	// Runs of options under the same group, each option with its index in `items`.
	const runs = $derived.by(() => {
		const list: Array<{ group?: string; entries: Array<{ item: I; index: number }> }> = [];
		items.forEach((item, index) => {
			const last = list.at(-1);
			if (last && last.group === item.group) last.entries.push({ item, index });
			else list.push({ group: item.group, entries: [{ item, index }] });
		});
		return list;
	});

	let list = $state<HTMLElement | null>(null);

	const enter: Attachment<HTMLElement> = (node) => {
		if (anchor) node.style.minInlineSize = `${anchor.getBoundingClientRect().width}px`;
		node.showPopover();
	};

	// The active option stays in view as the keys move it.
	$effect(() => {
		if (active < 0 || !list) return;
		list.querySelector(`#${CSS.escape(`${id}-${active}`)}`)?.scrollIntoView({ block: 'nearest' });
	});
</script>

{#snippet entry(item: I, index: number)}
	<!-- Options are pressed with the pointer and chosen with the keys on the field, which keeps
	     focus and names the active option with aria-activedescendant, so they take no focus. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
	<div
		id="{id}-{index}"
		role="option"
		aria-selected={index === active}
		aria-disabled={item.disabled || undefined}
		class={['sv-listbox__option', item.value === chosen && 'sv-listbox__option--chosen']}
		onpointerdown={(event) => event.preventDefault()}
		onpointermove={() => !item.disabled && index !== active && onhover(index)}
		onclick={() => !item.disabled && onpick(index)}
	>
		<svg class="sv-listbox__check" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M5 12.5l4.5 4.5L19 7.5" />
		</svg>
		<span class="sv-listbox__text">
			{#if option}
				{@render option(item)}
			{:else}
				<span class="sv-listbox__label">{item.label}</span>
				{#if item.description}<span class="sv-listbox__description">{item.description}</span>{/if}
			{/if}
		</span>
	</div>
{/snippet}

<div
	bind:this={list}
	{id}
	role={items.length > 0 ? 'listbox' : undefined}
	aria-labelledby={items.length > 0 ? labelledby : undefined}
	aria-label={items.length > 0 ? label : undefined}
	popover="manual"
	class="sv-listbox"
	{@attach anchored({ anchor })}
	{@attach dismissable({ onDismiss: onclose, inside: () => [anchor] })}
	{@attach enter}
	transition:pop
>
	{#each runs as run, r (r)}
		{#if run.group === undefined}
			{#each run.entries as { item, index } (index)}{@render entry(item, index)}{/each}
		{:else}
			<div role="group" aria-labelledby="{id}-group-{r}">
				<div role="presentation" id="{id}-group-{r}" class="sv-listbox__group">{run.group}</div>
				{#each run.entries as { item, index } (index)}{@render entry(item, index)}{/each}
			</div>
		{/if}
	{:else}
		<div role="status" class="sv-listbox__empty">{empty}</div>
	{/each}
</div>
