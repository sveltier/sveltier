<script lang="ts">
	// Where the toasts show: the region in the top layer and the live regions that read them
	// out. The provider renders one at the end of the page, and the modal shell one inside each
	// open dialog; only the topmost outlet shows the toasts.
	import { flip } from 'svelte/animate';
	import { on } from 'svelte/events';
	import { easing, fade, motion, rise } from '../../primitives/motion/motion.js';
	import '../../styles/visually-hidden.css';
	import { useLocale } from '../locale/locale.js';
	import { sharedClasses } from '../props/classes.js';
	import './toast.css';
	import type { ToastEntry, Toasts } from './toast.svelte.js';

	let {
		toasts,
		outlet,
		ref = $bindable(null)
	}: {
		toasts: Toasts;
		/** This outlet's token, which the toasts compare with their topmost outlet. */
		outlet: object;
		/** The region, which a dialog counts as inside itself. */
		ref?: HTMLElement | null;
	} = $props();

	const locale = useLocale();
	const top = $derived(toasts.top === outlet);
	const style = $derived(toasts.style);
	const notes = $derived(top ? toasts.announcements : []);

	const CLOSE =
		'M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z';

	// The region joins the top layer when it starts showing toasts, and again each time it
	// becomes the topmost outlet, so it sits above whatever opened before. Emptied, it stays,
	// which lets the last toast fade out.
	const showing = $derived(top && toasts.list.length > 0);
	$effect(() => {
		if (!showing || !ref) return;
		if (ref.matches(':popover-open')) ref.hidePopover();
		ref.showPopover();
	});

	// The timers wait while the pointer or focus is on the toasts.
	const hover = {};
	const focus = {};
	$effect(() => {
		if (!top) return;
		return () => {
			toasts.resume(hover);
			toasts.resume(focus);
		};
	});

	// Where focus goes back to when the user leaves the toasts.
	let back: HTMLElement | null = null;

	// F8 moves focus to the toasts, the way to reach an action before its toast leaves; Escape
	// in them goes back to where focus came from. Captured, so the layer stack never sees that
	// Escape and an open dialog stays open.
	$effect(() => {
		if (!top) return;
		return on(document, 'keydown', onkey, { capture: true });
	});

	function onkey(event: KeyboardEvent) {
		if (!ref) return;
		const inside = ref.contains(document.activeElement);
		if (event.key === 'Escape') {
			if (!inside || !back?.isConnected) return;
			event.preventDefault();
			goBack();
			return;
		}
		const plain = !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
		if (event.key !== 'F8' || !plain || toasts.list.length === 0) return;
		event.preventDefault();
		if (!inside) back = focused(document.activeElement);
		ref.focus();
	}

	const focused = (element: unknown) =>
		element instanceof HTMLElement && element !== document.body ? element : null;

	function enter(event: FocusEvent) {
		toasts.pause(focus);
		if (!ref?.contains(event.relatedTarget as Node | null)) {
			back = focused(event.relatedTarget) ?? back;
		}
	}

	function exit(event: FocusEvent) {
		if (!(event.relatedTarget instanceof Node && ref?.contains(event.relatedTarget))) {
			toasts.resume(focus);
		}
	}

	function goBack() {
		if (back?.isConnected) back.focus();
		back = null;
	}

	// A toast that closes with focus in it hands focus on first: to the toasts left, else back.
	function leave() {
		if (!ref?.contains(document.activeElement)) return;
		if (toasts.list.length > 1) ref.focus();
		else goBack();
	}

	function act(toast: ToastEntry) {
		leave();
		try {
			toast.action?.onclick();
		} finally {
			toasts.dismiss(toast.id);
		}
	}

	function close(toast: ToastEntry) {
		leave();
		toasts.dismiss(toast.id);
	}

	// Toasts below one that leaves move into its place with the theme's timing.
	function move(node: Element, rects: { from: DOMRect; to: DOMRect }) {
		const timing = motion(node);
		return flip(node, rects, { duration: timing.normal, easing: easing(timing.ease) });
	}
</script>

<!-- Read out once each, then emptied: the toasts themselves are not live. -->
{#snippet read(assertive: boolean)}
	{#each notes as note (note.id)}
		{#if note.assertive === assertive}<p>{note.message}</p>
			{#if note.action}<p>{note.action}</p>{/if}{/if}
	{/each}
{/snippet}
<div class="sv-visually-hidden" aria-live="polite">{@render read(false)}</div>
<div class="sv-visually-hidden" aria-live="assertive">{@render read(true)}</div>

<section
	bind:this={ref}
	popover="manual"
	tabindex="-1"
	aria-label="{locale.t('notifications')} (F8)"
	class="sv-toasts"
	onfocusin={enter}
	onfocusout={exit}
>
	{#if top}
		<ol
			class="sv-toasts__list"
			onpointerenter={() => toasts.pause(hover)}
			onpointerleave={() => toasts.resume(hover)}
		>
			{#each toasts.list as toast (toast.id)}
				<li
					class={[
						'sv-toast',
						sharedClasses(
							{
								variant: 'flat',
								color: toast.color,
								density: style.density,
								rounded: style.rounded
							},
							'Toast'
						)
					]}
					in:rise
					out:fade
					animate:move
				>
					<p class="sv-toast__message">{toast.message}</p>
					{#if toast.action}
						<button type="button" class="sv-toast__action" onclick={() => act(toast)}>
							{toast.action.label}
						</button>
					{/if}
					<button
						type="button"
						class="sv-toast__close"
						aria-label={locale.t('close')}
						onclick={() => close(toast)}
					>
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={CLOSE} /></svg>
					</button>
				</li>
			{/each}
		</ol>
	{/if}
</section>
