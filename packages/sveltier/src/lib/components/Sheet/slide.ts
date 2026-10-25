import type { TransitionConfig } from 'svelte/transition';
import { easing, motion } from '../../primitives/motion/motion.js';
import type { SheetSide } from './types.js';

/**
 * How a panel against an edge comes in and goes: it slides the whole way from that edge, with
 * the theme's timing. Start and end follow the writing direction.
 */
export function slide(side: SheetSide): (node: Element) => TransitionConfig {
	return (node) => {
		const timing = motion(node);
		const rtl = getComputedStyle(node).direction === 'rtl';
		const axis = side === 'top' || side === 'bottom' ? 'Y' : 'X';
		const sign = side === 'bottom' ? 1 : side === 'top' ? -1 : (side === 'end') !== rtl ? 1 : -1;
		return {
			duration: timing.normal,
			easing: easing(timing.ease),
			css: (_, u) => `transform: translate${axis}(${sign * u * 100}%)`
		};
	};
}
