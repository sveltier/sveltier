<script lang="ts">
	// A modal panel against an edge of the screen, on the shared modal shell. See SheetProps.
	import type { TransitionConfig } from 'svelte/transition';
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { easing, motion } from '../../primitives/motion/motion.js';
	import Modal from '../Modal/Modal.svelte';
	import './sheet.css';
	import { SHEET_SIDES, type SheetDefaults, type SheetProps } from './types.js';

	let {
		size,
		density,
		rounded,
		side = 'end',
		open = $bindable(false),
		class: className,
		ref = $bindable(null),
		...rest
	}: SheetProps = $props();

	const resolve = useDefaults<SheetDefaults>('Sheet', {
		size: 'sm',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ size, density, rounded }));

	if (DEV) $effect(() => checkValue('Sheet', 'side', side, SHEET_SIDES));

	// The panel slides in from its edge, with the theme's timing; start and end follow the
	// writing direction.
	function slide(node: Element): TransitionConfig {
		const timing = motion(node);
		const rtl = getComputedStyle(node).direction === 'rtl';
		const axis = side === 'top' || side === 'bottom' ? 'Y' : 'X';
		const sign = side === 'bottom' ? 1 : side === 'top' ? -1 : (side === 'end') !== rtl ? 1 : -1;
		return {
			duration: timing.normal,
			easing: easing(timing.ease),
			css: (_, u) => `transform: translate${axis}(${sign * u * 100}%)`
		};
	}
</script>

<Modal
	{...rest}
	component="Sheet"
	placement={side}
	panelClass={sharedClasses(p, 'Sheet')}
	enter={slide}
	class={['sv-sheet', className]}
	bind:open
	bind:ref
/>
