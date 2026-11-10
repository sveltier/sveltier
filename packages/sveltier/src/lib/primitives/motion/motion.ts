import { Spring, prefersReducedMotion } from 'svelte/motion';
import type { TransitionConfig } from 'svelte/transition';
import { cubicBezier } from './easing.js';

/** The theme's timing at an element: durations in ms and the easing as a CSS value. */
export interface Motion {
	fast: number;
	normal: number;
	slow: number;
	ease: string;
}

/**
 * Reads the theme's timing where the element is: the theme in scope, and near-zero
 * durations while the user prefers reduced motion. For `element.animate()` and CSS.
 *
 * @example
 * const { normal, ease } = motion(row);
 * row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: normal, easing: ease });
 */
export function motion(element: Element): Motion {
	const style = getComputedStyle(element);
	const read = (name: string, fallback: number) => {
		const value = style.getPropertyValue(`--sv-duration-${name}`).trim();
		const ms = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
		return Number.isFinite(ms) ? ms : fallback;
	};
	return {
		fast: read('fast', 144),
		normal: read('normal', 233),
		slow: read('slow', 377),
		ease: style.getPropertyValue('--sv-ease').trim() || 'ease'
	};
}

const KEYWORDS: Record<string, [number, number, number, number]> = {
	linear: [0, 0, 1, 1],
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1]
};

/**
 * A CSS easing as a function, for Svelte transitions and `Tween`. Understands `cubic-bezier()`
 * and the keywords; anything else (`steps()`, `linear()`) falls back to `ease`.
 *
 * @example
 * const timing = motion(element);
 * const value = new Tween(0, { duration: timing.normal, easing: easing(timing.ease) });
 */
export function easing(ease: string): (t: number) => number {
	const points = /cubic-bezier\(([^)]+)\)/.exec(ease)?.[1]?.split(',').map(Number);
	const [x1, y1, x2, y2] =
		points?.length === 4 && points.every(Number.isFinite)
			? points
			: (KEYWORDS[ease.trim()] ?? KEYWORDS.ease!);
	return cubicBezier(x1!, y1!, x2!, y2!);
}

export interface TransitionOptions {
	/** In ms. Defaults to the theme's normal duration. */
	duration?: number;
	delay?: number;
}

function themed(
	node: Element,
	{ duration, delay = 0 }: TransitionOptions,
	css: (t: number, u: number) => string
): TransitionConfig {
	const timing = motion(node);
	return { delay, duration: duration ?? timing.normal, easing: easing(timing.ease), css };
}

/**
 * Fades in and out with the theme's timing.
 *
 * @example
 * {#if open}<div transition:fade>Saved</div>{/if}
 */
export function fade(node: Element, options: TransitionOptions = {}): TransitionConfig {
	return themed(node, options, (t) => `opacity: ${t}`);
}

/**
 * Fades in while moving up `distance` px (8 by default), with the theme's timing.
 *
 * @example
 * {#each toasts as toast (toast.id)}<div in:rise={{ distance: 13 }}>{toast.text}</div>{/each}
 */
export function rise(
	node: Element,
	{ distance = 8, ...options }: TransitionOptions & { distance?: number } = {}
): TransitionConfig {
	return themed(node, options, (t, u) => `opacity: ${t}; transform: translateY(${u * distance}px)`);
}

/**
 * Fades in while growing from `scale` (94.4%, 1 − φ⁻⁶), with the theme's timing.
 *
 * @example
 * {#if open}<div class="menu" transition:pop>…</div>{/if}
 */
export function pop(
	node: Element,
	{ scale = 0.944, ...options }: TransitionOptions & { scale?: number } = {}
): TransitionConfig {
	return themed(
		node,
		options,
		(t) => `opacity: ${t}; transform: scale(${scale + (1 - scale) * t})`
	);
}

/** Where `grow` starts: an element's box, a point on the screen, or nowhere. */
export type GrowSource = Element | { x: number; y: number } | null | undefined;

export interface GrowOptions extends TransitionOptions {
	/**
	 * What it grows out of, read as it starts each way: the control that opened it, or a point
	 * such as the pointer. Without one, or once it has no box, it pops in place.
	 */
	from?: () => GrowSource;
}

/**
 * Grows out of what opened it while fading in, and shrinks back into it as it goes, with the
 * theme's timing. It scales about the source's centre, from the source's size up to 94.4%
 * (1 − φ⁻⁶), never from less than 38.2% (φ⁻²). Without a source it pops in place.
 *
 * @example
 * {#if open}<div popover="manual" transition:grow={{ from: () => button }}>…</div>{/if}
 */
export function grow(
	node: Element,
	{ from, ...options }: GrowOptions = {}
): () => TransitionConfig {
	// Deferred, so it measures once the element is shown and placed.
	return () => {
		const source = from?.();
		const box = node.getBoundingClientRect();
		let rect: DOMRect | undefined;
		if (source instanceof Element) {
			const r = source.getBoundingClientRect();
			if (r.width || r.height) rect = r;
		} else if (source) {
			rect = new DOMRect(source.x, source.y);
		}
		let scale = 0.944;
		let origin = 'center';
		if (rect && box.width && box.height) {
			scale = Math.min(scale, Math.max(0.382, rect.width / box.width, rect.height / box.height));
			origin = `${rect.x + rect.width / 2 - box.x}px ${rect.y + rect.height / 2 - box.y}px`;
		}
		return themed(
			node,
			options,
			(t) =>
				`opacity: ${t}; transform-origin: ${origin}; transform: scale(${scale + (1 - scale) * t})`
		);
	};
}

/** Spring presets on the φ series: stiffness 1/φⁿ, damping 1 − 1/φⁿ. */
export const SPRINGS = {
	snappy: { stiffness: 0.236, damping: 0.764 },
	standard: { stiffness: 0.146, damping: 0.854 },
	gentle: { stiffness: 0.09, damping: 0.91 }
} as const;

export type SpringPreset = keyof typeof SPRINGS;

// The options of Spring.set, which older Svelte versions do not export as a named type.
type SpringUpdateOptions = Parameters<Spring<unknown>['set']>[1];

// A Svelte Spring whose updates are instant while the user prefers reduced motion.
class ReducibleSpring<T> extends Spring<T> {
	override set(value: T, options?: SpringUpdateOptions): Promise<void> {
		return super.set(value, {
			...options,
			instant: options?.instant ?? prefersReducedMotion.current
		});
	}
}

/**
 * A Svelte `Spring` with a φ preset that jumps straight to its target while the user prefers
 * reduced motion. For motion that is essential, `set(value, { instant: false })` still animates.
 *
 * @example
 * const balance = spring(0, 'gentle');
 * balance.target = 248190.35;
 */
export function spring<T>(value: T, preset: SpringPreset = 'standard'): Spring<T> {
	return new ReducibleSpring(value, SPRINGS[preset]);
}
