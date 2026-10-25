import type { Attachment } from 'svelte/attachments';

export const DISMISS_REASONS = ['escape', 'outside', 'focus'] as const;
export type DismissReason = (typeof DISMISS_REASONS)[number];

type Elements = Array<Element | null | undefined>;

export interface DismissableOptions {
	/** Called when the user dismisses the layer. The component decides whether to close. */
	onDismiss: (reason: DismissReason) => void;
	/** Dismiss on Escape, unless something inside handled it first. Defaults to `true`. */
	escape?: boolean;
	/** Dismiss on a pointer press outside. Defaults to `true`. */
	outside?: boolean;
	/** Dismiss when focus moves outside, as menus do on Tab. Defaults to `false`. */
	focusOutside?: boolean;
	/** Elements that count as inside, such as the trigger, which toggles instead. */
	inside?: Elements | (() => Elements);
	/**
	 * A layer the user does not work in, such as a tooltip. Escape closes it first, as the
	 * topmost layer, but a press outside closes it and still reaches the layer beneath, and focus
	 * moving out is left to the layers beneath. Defaults to `false`.
	 */
	transient?: boolean;
}

interface Layer {
	element: HTMLElement;
	options: DismissableOptions;
}

// Active layers, topmost last. One set of document listeners routes each event to the
// topmost layer only: with a listener per layer, a layer closed by an event would leave the
// stack (Svelte flushes between listeners) and the next layer would react to the same event.
const layers: Layer[] = [];
let touch = false;

function isInside({ element, options }: Layer, target: EventTarget | null): boolean {
	if (!(target instanceof Node)) return false;
	const inside = options.inside ?? [];
	return [element, ...(typeof inside === 'function' ? inside() : inside)].some((node) =>
		node?.contains(target)
	);
}

// A press on the page's own scrollbar is not a press outside.
const onScrollbar = (event: MouseEvent) =>
	event.target === document.documentElement &&
	(event.clientX >= document.documentElement.clientWidth ||
		event.clientY >= document.documentElement.clientHeight);

// The press goes to the topmost layer, through any transient layers above it, which close.
function dismissOutside(event: MouseEvent) {
	if (onScrollbar(event)) return;
	for (const layer of layers.toReversed()) {
		if (isInside(layer, event.target)) return;
		if (layer.options.outside !== false) layer.options.onDismiss('outside');
		if (!layer.options.transient) return;
	}
}

// Escape listens in the bubble phase, so handlers inside run first and can prevent it.
function onkeydown(event: KeyboardEvent) {
	const top = layers.at(-1);
	if (event.key === 'Escape' && !event.defaultPrevented && top && top.options.escape !== false) {
		event.preventDefault();
		top.options.onDismiss('escape');
	}
}

function onpointerdown(event: PointerEvent) {
	touch = event.pointerType === 'touch';
	if (!touch && event.button === 0) dismissOutside(event);
}

// Touch dismisses on the click that ends a tap, never on a press that starts a scroll.
function onclick(event: MouseEvent) {
	if (touch) dismissOutside(event);
	touch = false;
}

function onfocusin(event: FocusEvent) {
	const top = layers.findLast((layer) => !layer.options.transient);
	if (top?.options.focusOutside && !isInside(top, event.target)) top.options.onDismiss('focus');
}

function listen() {
	document.addEventListener('keydown', onkeydown);
	document.addEventListener('pointerdown', onpointerdown, true);
	document.addEventListener('click', onclick, true);
	document.addEventListener('focusin', onfocusin, true);
}

function unlisten() {
	document.removeEventListener('keydown', onkeydown);
	document.removeEventListener('pointerdown', onpointerdown, true);
	document.removeEventListener('click', onclick, true);
	document.removeEventListener('focusin', onfocusin, true);
}

/**
 * Registers the element as a layer: Escape, a press outside, or (opt-in) focus leaving it
 * calls `onDismiss` with the reason. Layers stack, and only the topmost one is dismissed, so
 * nested popovers, sheets and dialogs close one at a time.
 *
 * @example
 * <div popover="manual" {@attach dismissable({ onDismiss: () => (open = false), inside: [trigger] })}>
 */
export function dismissable(options: DismissableOptions): Attachment<HTMLElement> {
	return (element) => {
		const layer: Layer = { element, options };
		// A layer mounted around active layers (children attach first) goes beneath them.
		const inner = layers.findIndex((other) => element.contains(other.element));
		if (inner < 0) layers.push(layer);
		else layers.splice(inner, 0, layer);
		if (layers.length === 1) listen();

		return () => {
			layers.splice(layers.indexOf(layer), 1);
			if (layers.length === 0) unlisten();
		};
	};
}
