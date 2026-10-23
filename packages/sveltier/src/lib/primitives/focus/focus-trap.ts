import type { Attachment } from 'svelte/attachments';
import { tabbable, type FocusableElement } from './tabbable.js';

export interface FocusTrapOptions {
	/**
	 * Where focus goes when the trap starts, unless it is already inside: an element, a selector
	 * inside the container, or `false` to leave it where it is. Defaults to the first tabbable
	 * element, else the container.
	 */
	initialFocus?: FocusableElement | string | false;
	/**
	 * Where focus goes when the trap ends: `true` for the element that had it when the trap
	 * started, an element (pass the trigger: Safari does not focus a button on click, so the
	 * element that had focus may be the page itself), or `false` to leave it. Defaults to `true`.
	 */
	returnFocus?: boolean | FocusableElement | null;
}

interface Trap {
	container: HTMLElement;
	/** Moves focus back inside: to the last focused element, else the first tabbable. */
	resume(): void;
}

// Active traps, innermost last. Only the last one acts.
const traps: Trap[] = [];

/**
 * Keeps keyboard focus inside the element: Tab and Shift+Tab wrap at the edges, and focus
 * that leaves by pointer or script is brought back. Traps stack: a trap inside another, or
 * opened after it, takes over until it ends, then the previous one resumes.
 *
 * @example
 * <div role="dialog" aria-modal="true" {@attach open && focusTrap()}>…</div>
 */
export function focusTrap({
	initialFocus,
	returnFocus = true
}: FocusTrapOptions = {}): Attachment<HTMLElement> {
	return (container) => {
		const previous = returnFocus === true ? document.activeElement : returnFocus;
		let madeFocusable = false;
		let last: FocusableElement | undefined;

		function enter(target: FocusableElement | null | undefined) {
			if (target) return target.focus();
			if (!container.hasAttribute('tabindex')) {
				container.tabIndex = -1;
				madeFocusable = true;
			}
			container.focus();
		}

		const trap: Trap = {
			container,
			resume: () =>
				enter(last?.isConnected && container.contains(last) ? last : tabbable(container)[0])
		};
		const active = () => traps.at(-1) === trap;

		function onkeydown(event: KeyboardEvent) {
			if (event.key !== 'Tab' || event.defaultPrevented || !active()) return;
			const items = tabbable(container);
			const current = document.activeElement;
			const edge = event.shiftKey ? items[0] : items.at(-1);
			if (items.length === 0 || current === edge || !container.contains(current)) {
				event.preventDefault();
				enter(event.shiftKey ? items.at(-1) : items[0]);
			}
		}

		function onfocusin(event: FocusEvent) {
			if (!active()) return;
			const target = event.target as Node;
			if (container.contains(target)) last = target as FocusableElement;
			else trap.resume();
		}

		// A trap mounted around active traps (children attach first) goes beneath them.
		const inner = traps.findIndex((other) => container.contains(other.container));
		if (inner < 0) traps.push(trap);
		else traps.splice(inner, 0, trap);
		document.addEventListener('keydown', onkeydown, true);
		document.addEventListener('focusin', onfocusin, true);
		if (initialFocus !== false && !container.contains(document.activeElement)) {
			enter(
				typeof initialFocus === 'string'
					? container.querySelector<FocusableElement>(initialFocus)
					: (initialFocus ?? tabbable(container)[0])
			);
		}

		return () => {
			document.removeEventListener('keydown', onkeydown, true);
			document.removeEventListener('focusin', onfocusin, true);
			traps.splice(traps.indexOf(trap), 1);
			if (madeFocusable) container.removeAttribute('tabindex');
			// In a later task: after the other attachments of the closing surface have cleaned up
			// (inertOthers may still hold the page inert now) and after the browser has moved
			// focus for the press that closed it. Then give focus back if it is still ours
			// (inside the trap, or lost to the page), and let the trap below take over again.
			setTimeout(() => {
				const focused = document.activeElement;
				const lost = !focused || focused === document.body || container.contains(focused);
				const restorable = previous instanceof HTMLElement || previous instanceof SVGElement;
				if (lost && restorable && previous.isConnected) previous.focus();
				const below = traps.at(-1);
				if (below && !below.container.contains(document.activeElement)) below.resume();
			});
		};
	};
}
