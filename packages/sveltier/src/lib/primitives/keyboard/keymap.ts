import type { Attachment } from 'svelte/attachments';

/** Runs for a key combination. Return `false` to let the event through unhandled. */
export type KeyHandler = (event: KeyboardEvent) => void | false;

/**
 * The combination of an event as `keymap` names it: `Ctrl+Alt+Shift+Meta+Key`. With `rtl`
 * given, horizontal arrows become `ArrowForward` / `ArrowBackward` for that direction.
 */
export function combination(event: KeyboardEvent, rtl?: boolean): string {
	let key = event.key;
	if (rtl !== undefined && (key === 'ArrowRight' || key === 'ArrowLeft')) {
		key = (key === 'ArrowRight') !== rtl ? 'ArrowForward' : 'ArrowBackward';
	}
	// event.key already carries Shift for characters: "?" rather than "Shift+/".
	const shift = event.shiftKey && key.length > 1;
	return (
		(event.ctrlKey ? 'Ctrl+' : '') +
		(event.altKey ? 'Alt+' : '') +
		(shift ? 'Shift+' : '') +
		(event.metaKey ? 'Meta+' : '') +
		key
	);
}

/**
 * Binds keys to handlers on the element. A handled key has its default prevented. Write
 * combinations as `Ctrl+Alt+Shift+Meta+Key` with `event.key` names; `ArrowForward` and
 * `ArrowBackward` follow the writing direction, and physical arrow names work too.
 *
 * @example
 * <div role="slider" {@attach keymap({ ArrowForward: up, ArrowBackward: down, Home: min, End: max })}>
 */
export function keymap(map: Record<string, KeyHandler>): Attachment<HTMLElement> {
	return (element) => {
		function onkeydown(event: KeyboardEvent) {
			if (event.defaultPrevented) return;
			const rtl = getComputedStyle(element).direction === 'rtl';
			const handler = map[combination(event, rtl)] ?? map[combination(event)];
			if (handler && handler(event) !== false) event.preventDefault();
		}
		element.addEventListener('keydown', onkeydown);
		return () => element.removeEventListener('keydown', onkeydown);
	};
}
