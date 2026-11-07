<script lang="ts">
	// The open menu that Menu and ContextMenu share: its items, roving focus, typeahead, and the
	// keys that close it. Its owner decides where it goes and what closing does.
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CloseReason } from '../../core/overlay/types.js';
	import { rovingFocus } from '../../primitives/focus/roving-focus.js';
	import { typeahead } from '../../primitives/keyboard/typeahead.js';
	import { dismissable } from '../../primitives/layer/dismissable.js';
	import { pop } from '../../primitives/motion/motion.js';
	import type { MenuAction, MenuItem } from './types.js';

	let {
		open,
		items,
		id,
		from,
		place,
		inside,
		close,
		choose,
		ref = $bindable(null),
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'popover' | 'role'> & {
		open: boolean;
		items: readonly MenuItem[];
		id: string;
		/** Which item takes focus as it opens. */
		from: 'first' | 'last';
		/** Puts the open menu where it belongs. */
		place: Attachment<HTMLElement>;
		/** Elements that count as inside it, so a press there does not close it. */
		inside: () => Array<Element | null>;
		close: (reason: CloseReason) => void;
		choose: (item: MenuAction) => void;
		ref?: HTMLDivElement | null;
	} = $props();

	// Runs of actions. A heading starts a named group, which a separator or the next heading ends.
	interface Group {
		heading?: string;
		actions: MenuAction[];
	}
	const blocks = $derived.by(() => {
		const list: Array<Group | 'separator'> = [];
		let group: Group | undefined;
		for (const item of items) {
			if ('separator' in item) {
				list.push('separator');
				group = undefined;
			} else if ('heading' in item) {
				group = { heading: item.heading, actions: [] };
				list.push(group);
			} else {
				if (!group) list.push((group = { actions: [] }));
				group.actions.push(item);
			}
		}
		return list;
	});

	const enter: Attachment<HTMLElement> = (menu) => {
		menu.showPopover();
	};

	// It reads `open` and `from`, so it runs again when the menu is opened while still closing:
	// the block then keeps the same menu and reverses its transition instead of making a new one.
	const focusIn: Attachment<HTMLElement> = (menu) => {
		if (!open) return;
		const enabled = menu.querySelectorAll<HTMLElement>('[data-sv-item]:not(:disabled)');
		(from === 'last' ? enabled[enabled.length - 1] : enabled[0])?.focus({ preventScroll: true });
	};

	// Tab and Shift+Tab close the menu once focus has moved on: the menu turns inert as it fades,
	// and the move must not start from there.
	function tab(event: KeyboardEvent) {
		if (event.key === 'Tab') setTimeout(() => close('focus'));
	}

	// The pointer and the keyboard share one highlight: the item under the pointer takes focus.
	function follow(event: PointerEvent & { currentTarget: HTMLButtonElement }) {
		if (document.activeElement !== event.currentTarget) {
			event.currentTarget.focus({ preventScroll: true });
		}
	}
</script>

{#snippet action(item: MenuAction)}
	<button
		type="button"
		role="menuitem"
		tabindex="-1"
		disabled={item.disabled}
		data-sv-item
		data-sv-label={item.label}
		class={['sv-menu__item', item.danger && 'sv-menu__item--danger']}
		onclick={() => choose(item)}
		onpointermove={follow}
	>
		{#if typeof item.icon === 'string'}
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={item.icon} /></svg>
		{:else if item.icon}
			<span class="sv-menu__icon" aria-hidden="true"><item.icon /></span>
		{/if}
		<span class="sv-menu__label">{item.label}</span>
		{#if item.shortcut}<kbd class="sv-menu__shortcut">{item.shortcut}</kbd>{/if}
	</button>
{/snippet}

{#if open}
	<div
		bind:this={ref}
		tabindex="-1"
		{...rest}
		{id}
		role="menu"
		popover="manual"
		{@attach enter}
		{@attach place}
		{@attach dismissable({ onDismiss: close, inside, focusOutside: true })}
		{@attach rovingFocus({ orientation: 'vertical' })}
		{@attach typeahead()}
		{@attach focusIn}
		onkeydown={tab}
		transition:pop
	>
		{#each blocks as block, index (index)}
			{#if block === 'separator'}
				<div role="separator" class="sv-menu__separator"></div>
			{:else}
				<div
					role={block.heading ? 'group' : 'none'}
					aria-labelledby={block.heading ? `${id}-${index}` : undefined}
				>
					{#if block.heading}
						<div role="presentation" id="{id}-{index}" class="sv-menu__heading">
							{block.heading}
						</div>
					{/if}
					{#each block.actions as item, i (i)}{@render action(item)}{/each}
				</div>
			{/if}
		{/each}
	</div>
{/if}
