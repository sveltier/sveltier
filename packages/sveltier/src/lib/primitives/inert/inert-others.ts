import type { Attachment } from 'svelte/attachments';

// Elements this module made inert, with how many active calls need them inert.
const owned = new Map<Element, number>();

/**
 * Makes everything outside the element inert (not focusable, not clickable, hidden from
 * assistive technology) while attached, for modal surfaces that are not a `<dialog>`.
 * Live regions stay active so announcements still reach screen readers. Calls stack: an
 * inner modal never reactivates what an outer one made inert, and elements that were inert
 * before stay inert.
 *
 * @example
 * <div role="dialog" aria-modal="true" {@attach open && inertOthers()}>…</div>
 */
export function inertOthers(): Attachment<HTMLElement> {
	return (element) => {
		const changed: Element[] = [];
		for (
			let node: Element = element;
			node.parentElement && node !== document.body;
			node = node.parentElement
		) {
			for (const sibling of node.parentElement.children) {
				if (sibling === node || sibling.matches('[aria-live]')) continue;
				const count = owned.get(sibling);
				if (count !== undefined) owned.set(sibling, count + 1);
				else if (sibling.hasAttribute('inert')) continue;
				else {
					owned.set(sibling, 1);
					sibling.setAttribute('inert', '');
				}
				changed.push(sibling);
			}
		}

		return () => {
			for (const sibling of changed) {
				const count = (owned.get(sibling) ?? 1) - 1;
				if (count > 0) owned.set(sibling, count);
				else {
					owned.delete(sibling);
					sibling.removeAttribute('inert');
				}
			}
		};
	};
}
