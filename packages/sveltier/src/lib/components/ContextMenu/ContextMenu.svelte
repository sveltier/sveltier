<script lang="ts">
	// A menu of actions on an element, opened where it is right-clicked. See ContextMenuProps.
	import type { Attachment } from 'svelte/attachments';
	import { DEV, warnRadioGroups } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import type { CloseReason } from '../../core/overlay/types.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../Menu/menu.css';
	import MenuPanel from '../Menu/MenuPanel.svelte';
	import type { MenuAction } from '../Menu/types.js';
	import { placeAt, type ContextPoint } from './place.js';
	import type {
		ContextMenuDefaults,
		ContextMenuProps,
		ContextMenuTargetAttributes
	} from './types.js';

	let {
		size,
		density,
		label,
		items,
		onselect,
		target,
		onopen,
		open = $bindable(false),
		onclose,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: ContextMenuProps = $props();

	const resolve = useDefaults<ContextMenuDefaults>('ContextMenu', {
		size: 'md',
		density: 'default'
	});
	const p = $derived(resolve({ size, density }));

	if (DEV) $effect(() => warnRadioGroups('ContextMenu', items));

	const uid = $props.id();
	const id = $derived(idProp ?? uid);

	// Where it opens, and the element that had focus then, which gets it back.
	let point = $state<ContextPoint>({ x: 0, below: 0, above: 0 });
	let opener: HTMLElement | null = null;

	function show(element: HTMLElement, at: ContextPoint) {
		onopen?.(element);
		// Focus goes back to what had it, else to the element itself where it takes focus: a press
		// does not focus a button in Safari, and the menu may hold focus when it opens again.
		const active = document.activeElement;
		opener =
			active instanceof HTMLElement && active !== document.body && !ref?.contains(active)
				? active
				: element.tabIndex >= 0
					? element
					: null;
		point = at;
		// Already open, where a press did not take focus out of it (Safari does not focus a
		// pressed button): it moves, and its first item takes focus again.
		if (open && ref) {
			ref
				.querySelector<HTMLElement>('[data-sv-item]:not(:disabled)')
				?.focus({ preventScroll: true });
		}
		open = true;
	}

	// Below the element, from its inline-start edge.
	function under(element: HTMLElement): ContextPoint {
		const box = element.getBoundingClientRect();
		const rtl = getComputedStyle(element).direction === 'rtl';
		return { x: rtl ? box.right : box.left, below: box.bottom, above: box.top };
	}

	const targetAttributes: ContextMenuTargetAttributes = {
		oncontextmenu: (event) => {
			// A menu on an inner element has already answered it.
			if (event.defaultPrevented) return;
			event.preventDefault();
			const element = event.currentTarget;
			// A keyboard's contextmenu event has no point of its own in some browsers.
			const keyed = event.clientX === 0 && event.clientY === 0;
			show(
				element,
				keyed ? under(element) : { x: event.clientX, below: event.clientY, above: event.clientY }
			);
		},
		onkeydown: (event) => {
			if (event.defaultPrevented) return;
			if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
			event.preventDefault();
			show(event.currentTarget, under(event.currentTarget));
		}
	};

	// Placed once at its point, inside the viewport. It reads `point`, so a right click elsewhere
	// while it is still closing moves it there.
	const place: Attachment<HTMLElement> = (menu) => {
		const { x, below, above } = point;
		// Its laid-out size: the opening transition scales it.
		const size = { width: menu.offsetWidth, height: menu.offsetHeight };
		const { left, top } = placeAt(
			{ x, below, above },
			size,
			{ width: document.documentElement.clientWidth, height: window.innerHeight },
			getComputedStyle(menu).direction === 'rtl'
		);
		menu.style.inset = 'auto';
		menu.style.margin = '0';
		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;
	};

	function close(reason: CloseReason) {
		if (!open) return;
		// Escape and a choice give focus back; Tab, a press or focus elsewhere have already chosen
		// where it goes.
		if ((reason === 'escape' || reason === 'action') && ref?.contains(document.activeElement)) {
			opener?.focus({ preventScroll: true });
		}
		open = false;
		onclose?.(reason);
	}

	function choose(item: MenuAction) {
		close('action');
		onselect?.(item);
	}
</script>

{@render target(targetAttributes)}

<MenuPanel
	bind:ref
	aria-label={label}
	{...rest}
	{open}
	{items}
	{id}
	from="first"
	class={['sv-menu', 'sv-context-menu', sharedClasses(p, 'ContextMenu'), className]}
	{place}
	source={() => ({ x: point.x, y: point.below })}
	inside={() => []}
	{close}
	{choose}
/>
