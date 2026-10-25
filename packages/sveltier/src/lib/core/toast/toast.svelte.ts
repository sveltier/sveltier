import { getContext, hasContext, setContext, untrack } from 'svelte';
import { sveltierError } from '../errors/errors.js';
import type { Color, Density, Rounded } from '../props/types.js';

/** The Toast props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ToastDefaults {
	/**
	 * The colour of a toast shown without one: `neutral` is the page inverted.
	 * @default 'neutral'
	 */
	color: Color;
	/**
	 * How long a toast stays, in ms, not counting the time it is hovered or focused. `0` keeps
	 * it until it is dismissed.
	 * @default 6000
	 */
	duration: number;
	/**
	 * Multiplies the padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../defaults/context.js' {
	interface ComponentDefaults {
		Toast: ToastDefaults;
	}
}

/** A button in a toast, such as Undo. The toast closes after `onclick` has run. */
export interface ToastAction {
	/** The button's text, short: "Undo", "Retry", "View". */
	label: string;
	onclick: () => void;
}

/** How a toast looks and how long it stays. Unset options take the Toast defaults. */
export interface ToastOptions {
	/** A button that acts on what the message reports, such as Undo. */
	action?: ToastAction;
	/** The colour. `error` is announced at once; the others wait for the screen reader to pause. */
	color?: Color;
	/** In ms, not counting the time it is hovered or focused. `0` keeps it until it is dismissed. */
	duration?: number;
}

/**
 * Short messages at the bottom of the screen that report what just happened, with a button
 * to act on it, such as Undo. At most three show at once, newest first; each leaves after
 * its duration, which waits while the pointer or focus is on the toasts. F8 moves focus to
 * them. While a Dialog or Sheet is open they show inside it, so they can still be pressed.
 * Returned by `useToast()`.
 *
 * @example
 * const toast = useToast();
 * toast.show('Payment sent', { action: { label: 'Undo', onclick: cancelPayment } });
 */
export interface ToastInstance {
	/** Shows `message` and returns the toast's id. */
	show(message: string, options?: ToastOptions): string;
	/** Closes the toast with this id, if it is still shown. */
	dismiss(id: string): void;
}

/** A toast as the outlets render it. */
export interface ToastEntry {
	id: string;
	message: string;
	color: Color;
	action?: ToastAction;
}

/** What the live regions read out: the message, then the action's label. */
export interface Announcement {
	id: string;
	message: string;
	action?: string;
	assertive: boolean;
}

interface Timer {
	remaining: number;
	started: number;
	handle?: ReturnType<typeof setTimeout>;
}

// At most this many on screen; a newer toast pushes the oldest out.
const MAX = 3;
// Long enough for a screen reader to take the text, short enough that switching outlets
// does not read it twice.
const ANNOUNCED = 1000;

/**
 * The toasts of an app: the queue, the timers and what to announce. Outlets render them: the
 * provider's at the end of the page, and one inside each open modal dialog, which makes the
 * rest of the page inert. The topmost outlet shows them all.
 */
export class Toasts {
	/** Newest first. */
	list: ToastEntry[] = $state.raw([]);
	announcements: Announcement[] = $state.raw([]);
	/** The provider's outlet, used while no modal dialog has one open. */
	readonly base = {};
	#outlets: object[] = $state.raw([]);
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- never read reactively
	#timers = new Map<string, Timer>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- never read reactively
	#pausers = new Set<object>();
	#count = 0;
	#defaults: () => ToastDefaults;

	constructor(defaults: () => ToastDefaults) {
		this.#defaults = defaults;
	}

	/** The outlet that shows the toasts. */
	get top(): object {
		return this.#outlets.at(-1) ?? this.base;
	}

	/** The density and rounding of every toast, from the provider's defaults. */
	get style(): Pick<ToastDefaults, 'density' | 'rounded'> {
		const { density, rounded } = this.#defaults();
		return { density, rounded };
	}

	// The methods below may run inside an effect, which must not come to depend on the lists
	// they change, so they read them untracked.

	/** Makes `outlet` the topmost until the returned function is called. */
	register(outlet: object): () => void {
		untrack(() => (this.#outlets = [...this.#outlets, outlet]));
		return () => untrack(() => (this.#outlets = this.#outlets.filter((other) => other !== outlet)));
	}

	show(message: string, { action, color, duration }: ToastOptions = {}): string {
		const id = `sv-toast-${++this.#count}`;
		// Toasts answer what the user does, so they belong to the browser: one shown while the
		// server renders would have nothing to hydrate into.
		if (typeof window === 'undefined') return id;
		const defaults = untrack(this.#defaults);
		const entry: ToastEntry = { id, message, color: color ?? defaults.color, action };
		untrack(() => (this.list = [entry, ...this.list]));
		for (const old of untrack(() => this.list.slice(MAX))) this.dismiss(old.id);
		const time = duration ?? defaults.duration;
		if (time > 0 && Number.isFinite(time)) {
			this.#timers.set(id, { remaining: time, started: 0 });
			if (this.#pausers.size === 0) this.#start(id);
		}
		this.#announce(entry);
		return id;
	}

	dismiss(id: string): void {
		this.#stop(id);
		this.#timers.delete(id);
		untrack(() => (this.list = this.list.filter((toast) => toast.id !== id)));
	}

	/** Stops every timer until each source has resumed: the pointer on the toasts, focus in them. */
	pause(source: object): void {
		if (this.#pausers.size === 0) for (const id of this.#timers.keys()) this.#stop(id);
		this.#pausers.add(source);
	}

	resume(source: object): void {
		if (!this.#pausers.delete(source) || this.#pausers.size > 0) return;
		for (const id of this.#timers.keys()) this.#start(id);
	}

	#start(id: string) {
		const timer = this.#timers.get(id);
		if (!timer) return;
		timer.started = performance.now();
		timer.handle = setTimeout(() => this.dismiss(id), timer.remaining);
	}

	#stop(id: string) {
		const timer = this.#timers.get(id);
		if (timer?.handle === undefined) return;
		clearTimeout(timer.handle);
		timer.handle = undefined;
		timer.remaining -= performance.now() - timer.started;
	}

	#announce({ id, message, action, color }: ToastEntry) {
		const note: Announcement = { id, message, action: action?.label, assertive: color === 'error' };
		untrack(() => (this.announcements = [...this.announcements, note]));
		setTimeout(() => {
			this.announcements = this.announcements.filter((other) => other !== note);
		}, ANNOUNCED);
	}
}

// A private symbol key instead of createContext(): its `has` function only exists from
// Svelte 5.57, and the supported range starts at 5.40.
const KEY = Symbol('sveltier.toasts');

/** The nearest provider's toasts, if there is one. */
export const getToasts = (): Toasts | undefined =>
	hasContext(KEY) ? getContext<Toasts>(KEY) : undefined;
export const setToasts = (toasts: Toasts): Toasts => setContext(KEY, toasts);

/**
 * Returns the toasts of the nearest `<UIProvider>` or `<ToastProvider>`. Call it while a
 * component initialises; call `show()` whenever something happens.
 *
 * @example
 * <script>
 *   import { Button, useToast } from '@sveltier/ui';
 *   const toast = useToast();
 * </script>
 *
 * <Button onclick={() => toast.show('Saved', { color: 'success' })}>Save</Button>
 */
export function useToast(): ToastInstance {
	const toasts = getToasts();
	if (!toasts) {
		throw sveltierError(
			'SV4003',
			'useToast() was called outside a <UIProvider>. Call it in a component inside <UIProvider>, or inside <ToastProvider> when the app uses <ThemeProvider> alone.'
		);
	}
	return {
		show: (message, options) => toasts.show(message, options),
		dismiss: (id) => toasts.dismiss(id)
	};
}
