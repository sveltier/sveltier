// Moves the bars of an app out of the way while the page is read on, and brings them back as it
// moves up. One scroll listener serves every bar, and only while one asks for it.
import type { Attachment } from 'svelte/attachments';
import { DEFAULT_THRESHOLDS, type Breakpoint } from '../../core/display/display.js';

/** How far, in px, the page travels one way before the bars follow it. */
const TRAVEL = 8;
/** Above this many px from the top of the page, the bars always show. */
const TOP = 89;

const bars = new Set<() => void>();
let away = false;
let last = 0;
let travel = 0;
let frame = 0;

function measure(): void {
	frame = 0;
	const y = scrollY;
	const delta = y - last;
	last = y;
	// Travel counts one way only: a turn starts it again.
	if (Math.sign(delta) !== Math.sign(travel)) travel = 0;
	travel += delta;
	const next = y < TOP ? false : travel > TRAVEL ? true : travel < -TRAVEL ? false : away;
	if (next === away) return;
	away = next;
	for (const update of bars) update();
}

function onscroll(): void {
	frame ||= requestAnimationFrame(measure);
}

/**
 * Marks the bar `data-sv-away` while the page is read on, at any width (`true`) or below a
 * breakpoint's default width, and its CSS moves it out of the way. A bar that holds the keyboard
 * focus stays: a focus a tap left behind does not hold it, or a phone's bar would never go.
 */
export const scrollAway =
	(below: true | Exclude<Breakpoint, 'xs'>): Attachment<HTMLElement> =>
	(node) => {
		const narrow =
			below === true ? undefined : matchMedia(`(width < ${DEFAULT_THRESHOLDS[below]}px)`);
		let held = false;
		const update = () =>
			node.toggleAttribute('data-sv-away', away && !held && (narrow?.matches ?? true));
		const focus = (event: FocusEvent) => {
			held = event.type === 'focusin' && (event.target as Element).matches(':focus-visible');
			update();
		};
		node.addEventListener('focusin', focus);
		node.addEventListener('focusout', focus);
		if (bars.size === 0) {
			last = scrollY;
			travel = 0;
			away = false;
			addEventListener('scroll', onscroll, { passive: true });
		}
		bars.add(update);
		narrow?.addEventListener('change', update);
		update();
		return () => {
			bars.delete(update);
			narrow?.removeEventListener('change', update);
			node.removeEventListener('focusin', focus);
			node.removeEventListener('focusout', focus);
			node.removeAttribute('data-sv-away');
			if (bars.size > 0) return;
			removeEventListener('scroll', onscroll);
			cancelAnimationFrame(frame);
			frame = 0;
		};
	};
