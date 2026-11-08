<script lang="ts">
	// A list of actions that opens from a control. See MenuProps.
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';
	import { checkValue, DEV, warnRadioGroups } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { ALIGNS, anchored, SIDES } from '../../primitives/anchored/anchored.js';
	import './menu.css';
	import MenuPanel from './MenuPanel.svelte';
	import type { MenuAction, MenuDefaults, MenuProps } from './types.js';

	let {
		size,
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

	const resolve = useDefaults<MenuDefaults>('Menu', { size: 'md', density: 'default' });
	const p = $derived(resolve({ size, density }));

	if (DEV) {
		$effect(() => checkValue('Menu', 'side', side, SIDES));
		$effect(() => checkValue('Menu', 'align', align, ALIGNS));
		$effect(() => warnRadioGroups('Menu', items));
	}

	const uid = $props.id();
	const id = $derived(idProp ?? uid);

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
	let from = $state<'first' | 'last'>('first');
	function show(start: 'first' | 'last') {
		from = start;
		// Already open: the arrow keys on the control still move into it.
		if (open && ref) {
			const enabled = ref.querySelectorAll<HTMLElement>('[data-sv-item]:not(:disabled)');
			(start === 'last' ? enabled[enabled.length - 1] : enabled[0])?.focus({ preventScroll: true });
		}
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
</script>

{@render trigger(triggerAttributes)}

<MenuPanel
	bind:ref
	aria-labelledby={anchor?.id}
	{...rest}
	{open}
	{items}
	{id}
	{from}
	class={['sv-menu', sharedClasses(p, 'Menu'), className]}
	place={anchored({ anchor, side, align })}
	inside={() => [anchor]}
	{close}
	{choose}
/>
