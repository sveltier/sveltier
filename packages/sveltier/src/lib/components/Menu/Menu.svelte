<script lang="ts">
	// A list of actions that opens from a control. See MenuProps.
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { ALIGNS, anchored, SIDES } from '../../primitives/anchored/anchored.js';
	import { rovingFocus } from '../../primitives/focus/roving-focus.js';
	import { typeahead } from '../../primitives/keyboard/typeahead.js';
	import { dismissable } from '../../primitives/layer/dismissable.js';
	import { pop } from '../../primitives/motion/motion.js';
	import './menu.css';
	import type { MenuAction, MenuDefaults, MenuProps } from './types.js';

	let {
		density,
		items,
		onselect,
		trigger,
		open = $bindable(false),
		side = 'bottom',
		align = 'start',
		onclose,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: MenuProps = $props();

	const resolve = useDefaults<MenuDefaults>('Menu', { density: 'default' });
	const p = $derived(resolve({ density }));

	if (DEV) {
		$effect(() => checkValue('Menu', 'side', side, SIDES));
		$effect(() => checkValue('Menu', 'align', align, ALIGNS));
	}

	const uid = $props.id();
	const id = $derived(idProp ?? uid);

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

	// The control that opens it: the menu is placed against it, named by it, and gives focus back.
	let anchor = $state<HTMLElement | null>(null);
	const capture: Attachment<HTMLElement> = (node) => {
		node.id ||= `${uid}-trigger`;
		anchor = node;
		return () => {
			if (anchor === node) anchor = null;
		};
	};

	// Which item takes focus as the menu opens: the last after ArrowUp, else the first.
	let from: 'first' | 'last' = 'first';
	function show(start: 'first' | 'last') {
		from = start;
		if (open && ref) focusEnd(ref);
		open = true;
	}

	const ANCHOR = createAttachmentKey();
	const triggerAttributes: TriggerAttributes = $derived({
		'aria-haspopup': 'menu',
		'aria-expanded': open,
		'aria-controls': open ? id : undefined,
		onclick: () => (open ? close('action') : show('first')),
		onkeydown: (event) => {
			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
			event.preventDefault();
			show(event.key === 'ArrowUp' ? 'last' : 'first');
		},
		[ANCHOR]: capture
	});

	function close(reason: CloseReason) {
		if (!open) return;
		// Escape and a choice give focus back to the control; Tab, a press or focus elsewhere
		// have already chosen where it goes.
		if ((reason === 'escape' || reason === 'action') && ref?.contains(document.activeElement)) {
			anchor?.focus({ preventScroll: true });
		}
		open = false;
		onclose?.(reason);
	}

	function choose(item: MenuAction) {
		close('action');
		onselect?.(item);
	}

	function focusEnd(menu: HTMLElement) {
		const enabled = menu.querySelectorAll<HTMLElement>('[data-sv-item]:not(:disabled)');
		(from === 'last' ? enabled[enabled.length - 1] : enabled[0])?.focus({ preventScroll: true });
	}

	const enter: Attachment<HTMLElement> = (menu) => {
		menu.showPopover();
		focusEnd(menu);
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
		{#if item.icon}
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={item.icon} /></svg>
		{/if}
		<span class="sv-menu__label">{item.label}</span>
		{#if item.shortcut}<kbd class="sv-menu__shortcut">{item.shortcut}</kbd>{/if}
	</button>
{/snippet}

{@render trigger(triggerAttributes)}

{#if open}
	<div
		bind:this={ref}
		aria-labelledby={anchor?.id}
		tabindex="-1"
		{...rest}
		{id}
		role="menu"
		popover="manual"
		class={['sv-menu', sharedClasses(p, 'Menu'), className]}
		{@attach anchored({ anchor, side, align })}
		{@attach dismissable({ onDismiss: close, inside: () => [anchor], focusOutside: true })}
		{@attach rovingFocus({ orientation: 'vertical' })}
		{@attach typeahead()}
		{@attach enter}
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
