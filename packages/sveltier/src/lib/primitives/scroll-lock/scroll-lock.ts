import type { Attachment } from 'svelte/attachments';

let locks = 0;
let restore: (() => void) | undefined;

/**
 * Stops the page from scrolling while the element is attached, for modal surfaces. The
 * scrollbar's width is kept as padding, so the layout does not shift. Locks are counted, so
 * nested modals are safe: the page scrolls again when the last one ends.
 *
 * @example
 * <dialog {@attach open && scrollLock()}>…</dialog>
 */
export function scrollLock(): Attachment {
	return () => {
		if (locks++ === 0) {
			const html = document.documentElement;
			const { overflow, paddingInlineEnd } = html.style;
			const scrollbar = window.innerWidth - html.clientWidth;
			const gutter = getComputedStyle(html).scrollbarGutter.includes('stable');
			if (scrollbar > 0 && !gutter) {
				const padding = parseFloat(getComputedStyle(html).paddingInlineEnd) || 0;
				html.style.paddingInlineEnd = `${padding + scrollbar}px`;
			}
			html.style.overflow = 'hidden';
			restore = () => {
				html.style.overflow = overflow;
				html.style.paddingInlineEnd = paddingInlineEnd;
			};
		}
		return () => {
			if (--locks === 0) restore?.();
		};
	};
}
