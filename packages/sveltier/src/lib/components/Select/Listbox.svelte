<script lang="ts" generics="T extends string | number, I extends SelectOption<T> = SelectOption<T>">
	// The popup list of a Select or a Combobox: options in groups, in the top layer, placed under
	// the field; on a phone, across the window and down to the bottom of what it shows. Focus
	// stays on the field; `active` is the option it points at.
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { anchored } from '../../primitives/anchored/anchored.js';
	import { dismissable, type DismissReason } from '../../primitives/layer/dismissable.js';
	import { grow } from '../../primitives/motion/motion.js';
	import { groupRuns, type SelectOption } from './options.js';

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
		height,
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
		/** The most height of the list, a CSS length; the stylesheet's when not given. */
		height?: string;
		onpick: (index: number) => void;
		onhover: (index: number) => void;
		onclose: (reason: DismissReason) => void;
	} = $props();

	const runs = $derived(groupRuns(items));

	let list = $state<HTMLElement | null>(null);

	// Narrower than `sm`, a phone: the list spans the window under the field, with rows a thumb
	// can hit. It only exists in the browser while open, so it reads the window once.
	const phone = matchMedia('(width < 600px)').matches;

	/** The space kept between the field and the list under it, and below the list, in px. */
	const GAP = 8;
	/** The least height the list keeps when the room under the field is shorter, in px. */
	const LEAST = 144;

	// On a phone the list hangs from the field, so a list that typing has narrowed to a few
	// options stays where the eye is, and reaches down to the bottom of the visual viewport, which
	// the on-screen keyboard shrinks while the layout viewport, and `dvh`, stay whole: so it ends
	// on the keyboard, not behind it. When the room under the field is less than half of what
	// shows, the field first goes to the top of the window.
	const hang: Attachment<HTMLElement> = (node) => {
		const view = window.visualViewport;
		const place = () => {
			const top = view?.offsetTop ?? 0;
			const bottom = view ? top + view.height : innerHeight;
			const field = anchor?.getBoundingClientRect().bottom ?? top;
			node.style.setProperty('inset-block-start', `${field + GAP}px`);
			node.style.setProperty('--sv-listbox-room', `${Math.max(bottom - field - 2 * GAP, LEAST)}px`);
		};
		const top = view?.offsetTop ?? 0;
		const shown = view?.height ?? innerHeight;
		const field = anchor?.getBoundingClientRect().bottom ?? top;
		// The whole field goes up, its label too.
		if (anchor && top + shown - field < shown / 2) {
			(anchor.closest('.sv-field') ?? anchor).scrollIntoView({ block: 'start' });
		}
		place();
		view?.addEventListener('resize', place);
		view?.addEventListener('scroll', place);
		addEventListener('scroll', place, { capture: true, passive: true });
		addEventListener('resize', place);
		return () => {
			view?.removeEventListener('resize', place);
			view?.removeEventListener('scroll', place);
			removeEventListener('scroll', place, { capture: true });
			removeEventListener('resize', place);
			node.style.removeProperty('inset-block-start');
			node.style.removeProperty('--sv-listbox-room');
		};
	};

	const enter: Attachment<HTMLElement> = (node) => {
		// Under the field at least as wide as it; on a phone the stylesheet spans the window.
		if (anchor && !phone) node.style.minInlineSize = `${anchor.getBoundingClientRect().width}px`;
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
	class={['sv-listbox', phone && 'sv-listbox--phone']}
	style:--sv-listbox-height={height}
	{@attach phone ? hang : anchored({ anchor })}
	{@attach dismissable({ onDismiss: onclose, inside: () => [anchor] })}
	{@attach enter}
	transition:grow={{ from: () => anchor }}
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
