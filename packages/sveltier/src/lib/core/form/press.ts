// A press on the page, from its pointerdown until its click. Focus that leaves a field because of
// a press shows the field's message, and the line the message adds under the field moves what
// is below it: shown during the press, it would move the button being pressed before the
// release, and the click would land elsewhere. Fields show it once the press is over.

// The longest a click can come after its pointerup: a tap's comes a moment later. A press that
// makes no click (another button, a release off the page) is over after this.
const CLICK_DELAY = 300;

let pressing = false;
const waiting: Array<() => void> = [];
let timer: ReturnType<typeof setTimeout> | undefined;

function over() {
	pressing = false;
	for (const callback of waiting.splice(0)) callback();
}

function follow({ type }: Event) {
	clearTimeout(timer);
	if (type === 'pointerdown') pressing = true;
	else if (type === 'pointerup') timer = setTimeout(over, CLICK_DELAY);
	else over();
}

/**
 * Follows presses on the page. Needs `window`: call from an effect. Every field calls it, and the
 * browser adds each listener once.
 */
export function followPresses(): void {
	for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'click']) {
		addEventListener(type, follow, true);
	}
}

/** Calls `callback` now, or once the press under way is over. */
export function afterPress(callback: () => void): void {
	if (pressing) waiting.push(callback);
	else callback();
}
