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

/** Fades in and out with the theme's timing. */
export function fade(node: Element, options: TransitionOptions = {}): TransitionConfig {
	return themed(node, options, (t) => `opacity: ${t}`);
}

/** Fades in while moving up `distance` px (8 by default), with the theme's timing. */
export function rise(
	node: Element,
	{ distance = 8, ...options }: TransitionOptions & { distance?: number } = {}
): TransitionConfig {
	return themed(node, options, (t, u) => `opacity: ${t}; transform: translateY(${u * distance}px)`);
}

/** Fades in while growing from `scale` (94.4%, 1 − φ⁻⁶), with the theme's timing. */
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
