<script module lang="ts">
	// Until when the next tooltip skips its delay: while one shows, and shortly after it hides,
	// so moving across a toolbar shows each one at once.
	let warmUntil = 0;
</script>

<script lang="ts">
	// A short text that describes a control, on hover and keyboard focus. See TooltipProps.
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';
	import { on } from 'svelte/events';
	import { checkValue, DEV, warnNamelessTrigger } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import type { TriggerAttributes } from '../../core/overlay/types.js';
	import { ALIGNS, anchored, SIDES } from '../../primitives/anchored/anchored.js';
	import { dismissable } from '../../primitives/layer/dismissable.js';
	import './tooltip.css';
	import type { TooltipDefaults, TooltipProps } from './types.js';

	let {
		text,
		trigger,
		side,
		align,
		delay,
		open = $bindable(false),
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: TooltipProps = $props();

	const resolve = useDefaults<TooltipDefaults>('Tooltip', {
		side: 'top',
		align: 'center',
		delay: 377
	});
	const p = $derived(resolve({ side, align, delay }));

	if (DEV) {
		$effect(() => checkValue('Tooltip', 'side', p.side, SIDES));
		$effect(() => checkValue('Tooltip', 'align', p.align, ALIGNS));
	}

	const uid = $props.id();
	const id = $derived(idProp ?? uid);

	// Room between the control and the tooltip, in px, clear of a focus ring.
	const OFFSET = 8;
	// Time to cross that room onto the tooltip before it hides, in ms.
	const GRACE = 144;
	const WARM = 377;

	// The control it describes, which it is placed against.
	let anchor = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;
	// A press on the control hides the tooltip until the pointer leaves it.
	let pressed = false;

	function show() {
		clearTimeout(timer);
		open = true;
	}

	function hide() {
		clearTimeout(timer);
		open = false;
	}

	function later(action: () => void, ms: number) {
		clearTimeout(timer);
		timer = setTimeout(action, ms);
	}

	// Touch has no hover: a tap is a press, and a long press belongs to the platform.
	function enter(event: PointerEvent) {
		if (event.pointerType === 'touch' || pressed) return;
		if (open || performance.now() < warmUntil) show();
		else later(show, p.delay);
	}

	function leave() {
		pressed = false;
		later(hide, GRACE);
	}

	function press() {
		pressed = true;
		hide();
	}

	// Keyboard focus shows it at once; a click that focuses the control does not.
	function focus(event: FocusEvent) {
		if ((event.currentTarget as HTMLElement).matches(':focus-visible')) show();
	}

	const control: Attachment<HTMLElement> = (node) => {
		anchor = node;
		if (DEV) warnNamelessTrigger('Tooltip', node);
		const stops = [
			on(node, 'pointerenter', enter),
			on(node, 'pointerleave', leave),
			on(node, 'pointerdown', press),
			on(node, 'focus', focus),
			on(node, 'blur', hide)
		];
		return () => {
			for (const stop of stops) stop();
			clearTimeout(timer);
			if (anchor === node) anchor = null;
		};
	};
	const CONTROL = createAttachmentKey();
	const triggerAttributes: TriggerAttributes = $derived({
		'aria-describedby': id,
		[CONTROL]: control
	});

	// In the top layer while open. It stays placed until it has faded out, and a hidden tooltip
	// is not placed at all, so a page with many of them pays nothing for those not shown.
	let leaving = $state(false);
	const popover: Attachment<HTMLElement> = (node) => {
		if (!open) return;
		node.showPopover();
		warmUntil = Infinity;
		return () => {
			warmUntil = performance.now() + WARM;
			if (!node.matches(':popover-open')) return;
			node.hidePopover();
			leaving = true;
			void Promise.allSettled(node.getAnimations().map(({ finished }) => finished)).then(
				() => (leaving = false)
			);
		};
	};
	const place: Attachment<HTMLElement> = (node) => {
		if (open || leaving) {
			return anchored({ anchor, side: p.side, align: p.align, offset: OFFSET })(node);
		}
	};
	// Escape hides it first, as the topmost layer; a press outside hides it and goes through.
	const layer: Attachment<HTMLElement> = (node) => {
		if (open) return dismissable({ onDismiss: hide, transient: true })(node);
	};
</script>

{@render trigger(triggerAttributes)}
<div
	bind:this={ref}
	{...rest}
	{id}
	role="tooltip"
	popover="manual"
	class={['sv-tooltip', className]}
	{@attach popover}
	{@attach place}
	{@attach layer}
	onpointerenter={() => clearTimeout(timer)}
	onpointerleave={leave}
>
	{text}
</div>
