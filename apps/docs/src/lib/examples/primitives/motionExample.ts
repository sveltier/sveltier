import { Tween } from 'svelte/motion';
import { easing, motion } from '@sveltier/ui';

// element.animate() takes the theme's easing as it is.
export function flash(cell: HTMLElement) {
	const { fast, ease } = motion(cell);
	cell.animate([{ opacity: 0.382 }, { opacity: 1 }], { duration: fast, easing: ease });
}

// Tween needs a function: easing() turns the curve into one.
export function progress(element: HTMLElement) {
	const { slow, ease } = motion(element);
	return new Tween(0, { duration: slow, easing: easing(ease) });
}
