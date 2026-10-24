<script lang="ts">
	// A modal <dialog> in the top layer with a panel: the shell of Dialog and Sheet. See
	// ModalProps.
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';
	import { DEV, warnUnnamed } from '#dev';
	import { useLocale } from '../../core/locale/locale.js';
	import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
	import { focusTrap } from '../../primitives/focus/focus-trap.js';
	import { dismissable } from '../../primitives/layer/dismissable.js';
	import { fade } from '../../primitives/motion/motion.js';
	import { scrollLock } from '../../primitives/scroll-lock/scroll-lock.js';
	import './modal.css';
	import type { ModalProps } from './types.js';

	let {
		component,
		placement,
		panelClass,
		enter,
		open = $bindable(false),
		title,
		children,
		actions,
		trigger,
		persistent = false,
		closable = false,
		closeLabel,
		fullscreen = false,
		onclose,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: ModalProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const locale = useLocale();

	const CLOSE =
		'M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z';

	// The control that opened it: focus goes back to it, as Safari does not focus a clicked
	// button by itself.
	let opener = $state<HTMLElement | null>(null);
	const capture: Attachment<HTMLElement> = (node) => {
		opener = node;
		return () => {
			if (opener === node) opener = null;
		};
	};
	const OPENER = createAttachmentKey();
	const triggerAttributes: TriggerAttributes = $derived({
		'aria-haspopup': 'dialog',
		'aria-controls': open ? id : undefined,
		onclick: () => (open = true),
		[OPENER]: capture
	});

	function close(reason: CloseReason) {
		if (!open) return;
		open = false;
		onclose?.(reason);
	}

	// The top layer, with the rest of the page inert.
	const modal: Attachment<HTMLDialogElement> = (dialog) => {
		dialog.showModal();
		if (DEV) warnUnnamed(component, dialog, 'a title');
	};

	// Escape is left to the layer stack, so nested layers close one at a time. The browser may
	// still close the dialog itself: Chrome does after repeated presses, and a form with
	// method="dialog" does on submit. Either way the state follows, with the likely reason.
	let escaped = false;
	function cancel(event: Event) {
		event.preventDefault();
		escaped = true;
	}
</script>

{#if trigger}{@render trigger(triggerAttributes)}{/if}

{#if open}
	<dialog
		bind:this={ref}
		aria-labelledby={title ? `${id}-title` : undefined}
		{...rest}
		{id}
		class={['sv-modal', `sv-modal--${placement}`, fullscreen && 'sv-modal--fullscreen', className]}
		{@attach modal}
		{@attach scrollLock()}
		{@attach focusTrap({ returnFocus: opener ?? true })}
		oncancel={cancel}
		onclose={() => close(escaped ? 'escape' : 'action')}
		transition:fade
	>
		<!-- The scrim is the dialog itself, so a press beside the panel is a press outside it. -->
		<div
			class={['sv-modal__panel', panelClass]}
			{@attach dismissable({
				onDismiss: close,
				escape: !persistent,
				outside: !persistent
			})}
			transition:enter
		>
			{#if title || closable}
				<header class="sv-modal__header">
					{#if title}<h2 class="sv-modal__title" id="{id}-title">{title}</h2>{/if}
					{#if closable}
						<button
							type="button"
							class="sv-modal__close"
							aria-label={closeLabel ?? locale.t('close')}
							onclick={() => close('action')}
						>
							<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
								><path d={CLOSE} /></svg
							>
						</button>
					{/if}
				</header>
			{/if}
			{#if children}<div class="sv-modal__body">{@render children()}</div>{/if}
			{#if actions}
				<footer class="sv-modal__actions">
					{@render actions({ close: () => close('action') })}
				</footer>
			{/if}
		</div>
	</dialog>
{/if}
