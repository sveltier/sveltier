<script lang="ts">
	// A non-modal panel next to the control that opens it. See PopoverProps.
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';
	import { checkValue, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { ALIGNS, anchored, SIDES } from '../../primitives/anchored/anchored.js';
	import { tabbable } from '../../primitives/focus/tabbable.js';
	import { dismissable } from '../../primitives/layer/dismissable.js';
	import { pop } from '../../primitives/motion/motion.js';
	import './popover.css';
	import type { PopoverDefaults, PopoverProps } from './types.js';

	let {
		size,
		density,
		rounded,
		trigger,
		open = $bindable(false),
		title,
		children,
		actions,
		side = 'bottom',
		align = 'start',
		offset = 8,
		persistent = false,
		onclose,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: PopoverProps = $props();

	const resolve = useDefaults<PopoverDefaults>('Popover', {
		size: 'md',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ size, density, rounded }));

	if (DEV) {
		$effect(() => checkValue('Popover', 'side', side, SIDES));
		$effect(() => checkValue('Popover', 'align', align, ALIGNS));
	}

	const uid = $props.id();
	const id = $derived(idProp ?? uid);

	// The control that opens it: the panel is placed against it, and focus goes back to it.
	let anchor = $state<HTMLElement | null>(null);
	const capture: Attachment<HTMLElement> = (node) => {
		anchor = node;
		return () => {
			if (anchor === node) anchor = null;
		};
	};
	const ANCHOR = createAttachmentKey();
	const triggerAttributes: TriggerAttributes = $derived({
		'aria-haspopup': 'dialog',
		'aria-expanded': open,
		'aria-controls': open ? id : undefined,
		onclick: () => (open ? close('action') : (open = true)),
		[ANCHOR]: capture
	});

	function close(reason: CloseReason) {
		if (!open) return;
		// Closed from inside, focus goes back to the control; a press or a Tab elsewhere has
		// already chosen where it goes.
		if (ref?.contains(document.activeElement)) anchor?.focus({ preventScroll: true });
		open = false;
		onclose?.(reason);
	}

	// In the top layer, with focus on the element marked autofocus, else the first that takes
	// it, else the panel itself.
	const show: Attachment<HTMLElement> = (panel) => {
		panel.showPopover();
		if (DEV) warnUnnamed('Popover', panel, 'a title');
		const target = panel.querySelector<HTMLElement>('[autofocus]') ?? tabbable(panel)[0] ?? panel;
		target.focus({ preventScroll: true });
	};
</script>

{@render trigger(triggerAttributes)}

{#if open}
	<div
		bind:this={ref}
		aria-labelledby={title ? `${id}-title` : undefined}
		tabindex="-1"
		{...rest}
		{id}
		role="dialog"
		popover="manual"
		class={['sv-popover', sharedClasses(p, 'Popover'), className]}
		{@attach show}
		{@attach anchored({ anchor, side, align, offset })}
		{@attach dismissable({
			onDismiss: close,
			escape: !persistent,
			outside: !persistent,
			focusOutside: !persistent,
			inside: () => [anchor]
		})}
		transition:pop
	>
		{#if title}<div class="sv-popover__title" id="{id}-title">{title}</div>{/if}
		{#if children}<div class="sv-popover__body">{@render children()}</div>{/if}
		{#if actions}
			<div class="sv-popover__actions">{@render actions({ close: () => close('action') })}</div>
		{/if}
	</div>
{/if}
