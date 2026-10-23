import type { Attachment } from 'svelte/attachments';

export interface TypeaheadOptions {
	/** Selector for the items, inside the container. Defaults to `[data-sv-item]`. */
	items?: string;
	/** How long typed characters keep building one search, in ms. Defaults to 500. */
	timeout?: number;
	/** What a match does. Defaults to focusing the item. */
	onMatch?: (item: HTMLElement) => void;
}

const disabled = (item: HTMLElement) =>
	item.matches(':disabled') || item.getAttribute('aria-disabled') === 'true';

const label = (item: HTMLElement) =>
	(item.dataset.svLabel ?? item.getAttribute('aria-label') ?? item.textContent ?? '')
		.trim()
		.toLowerCase();

/**
 * Typing moves focus to the next item whose label starts with what was typed, as menus,
 * listboxes and trees do. Repeating one character cycles through the items starting with it.
 * Labels come from `data-sv-label`, `aria-label`, then the text.
 *
 * @example
 * <ul role="listbox" {@attach rovingFocus({ orientation: 'vertical' })} {@attach typeahead()}>
 */
export function typeahead({
	items = '[data-sv-item]',
	timeout = 500,
	onMatch = (item) => item.focus()
}: TypeaheadOptions = {}): Attachment<HTMLElement> {
	return (container) => {
		let search = '';
		let timer: ReturnType<typeof setTimeout> | undefined;

		function onkeydown(event: KeyboardEvent) {
			const key = event.key;
			if (
				event.defaultPrevented ||
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				key.length !== 1 ||
				(key === ' ' && search === '')
			) {
				return;
			}
			clearTimeout(timer);
			timer = setTimeout(() => (search = ''), timeout);
			search += key.toLowerCase();

			const list = Array.from(container.querySelectorAll<HTMLElement>(items)).filter(
				(item) => !disabled(item)
			);
			// "aaa" cycles through the items starting with "a".
			const repeated = [...search].every((character) => character === search[0]);
			const term = repeated ? search[0]! : search;
			const current = list.indexOf(document.activeElement as HTMLElement);
			// A new or one-letter search starts after the focused item; a longer one includes it.
			const from = term.length === 1 ? current + 1 : Math.max(current, 0);
			const ordered = [...list.slice(from), ...list.slice(0, from)];
			const match = ordered.find((item) => label(item).startsWith(term));
			if (match) {
				event.preventDefault();
				onMatch(match);
			}
		}

		container.addEventListener('keydown', onkeydown);
		return () => {
			clearTimeout(timer);
			container.removeEventListener('keydown', onkeydown);
		};
	};
}
