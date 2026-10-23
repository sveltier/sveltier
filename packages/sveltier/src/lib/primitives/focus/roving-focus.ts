import type { Attachment } from 'svelte/attachments';

export interface RovingFocusOptions {
	/** Which arrow keys move: left/right, up/down, or both. Defaults to `'horizontal'`. */
	orientation?: 'horizontal' | 'vertical' | 'both';
	/** Wrap from the last item to the first and back. Defaults to `true`. */
	loop?: boolean;
	/** Selector for the items, inside the container. Defaults to `[data-sv-item]`. */
	items?: string;
}

const disabled = (item: HTMLElement) =>
	item.matches(':disabled') || item.getAttribute('aria-disabled') === 'true';

/**
 * Gives a composite widget (toolbar, menu, radio group, tabs, listbox) one tab stop: the
 * active item has `tabindex="0"`, the others `-1`. Arrow keys move along the orientation
 * (left and right follow the writing direction), Home and End jump to the ends, and disabled
 * items are skipped. The first stop is the item marked selected, checked or current.
 *
 * @example
 * <div role="toolbar" {@attach rovingFocus()}>
 *   <button data-sv-item>Bold</button>
 *   <button data-sv-item>Italic</button>
 * </div>
 */
export function rovingFocus({
	orientation = 'horizontal',
	loop = true,
	items = '[data-sv-item]'
}: RovingFocusOptions = {}): Attachment<HTMLElement> {
	return (container) => {
		const all = () => Array.from(container.querySelectorAll<HTMLElement>(items));
		let current: HTMLElement | undefined;

		/** Makes `item` the tab stop, or keeps the current one, or picks the first enabled. */
		function sync(item?: HTMLElement) {
			const list = all();
			const enabled = list.filter((candidate) => !disabled(candidate));
			if (item) current = item;
			if (!current || !list.includes(current) || disabled(current)) {
				current =
					enabled.find((candidate) =>
						candidate.matches(
							'[aria-selected="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"])'
						)
					) ?? enabled[0];
			}
			for (const candidate of list) candidate.tabIndex = candidate === current ? 0 : -1;
		}

		function onkeydown(event: KeyboardEvent) {
			if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
			const list = all().filter((item) => !disabled(item));
			const index = list.indexOf(event.target as HTMLElement);
			if (index < 0) return;
			const forward = getComputedStyle(container).direction === 'rtl' ? -1 : 1;
			const horizontal = orientation !== 'vertical';
			const vertical = orientation !== 'horizontal';
			const step: Record<string, number | undefined> = {
				ArrowRight: horizontal ? forward : undefined,
				ArrowLeft: horizontal ? -forward : undefined,
				ArrowDown: vertical ? 1 : undefined,
				ArrowUp: vertical ? -1 : undefined
			};
			let next: number;
			if (event.key === 'Home') next = 0;
			else if (event.key === 'End') next = list.length - 1;
			else if (step[event.key] !== undefined) {
				next = index + step[event.key]!;
				next = loop
					? (next + list.length) % list.length
					: Math.min(Math.max(next, 0), list.length - 1);
			} else return;
			event.preventDefault();
			sync(list[next]);
			list[next]?.focus();
		}

		function onfocusin(event: FocusEvent) {
			const item = (event.target as Element).closest<HTMLElement>(items);
			if (item && container.contains(item) && !disabled(item)) sync(item);
		}

		// Items come and go (filtering, async data): keep exactly one tab stop.
		const observer = new MutationObserver(() => sync());
		observer.observe(container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['disabled', 'aria-disabled']
		});
		container.addEventListener('keydown', onkeydown);
		container.addEventListener('focusin', onfocusin);
		sync();

		return () => {
			observer.disconnect();
			container.removeEventListener('keydown', onkeydown);
			container.removeEventListener('focusin', onfocusin);
		};
	};
}
