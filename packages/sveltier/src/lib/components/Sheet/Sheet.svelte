<script lang="ts">
	// A modal panel against an edge of the screen, on the shared modal shell. See SheetProps.
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import Modal from '../Modal/Modal.svelte';
	import './sheet.css';
	import { slide } from './slide.js';
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
</script>

<Modal
	{...rest}
	component="Sheet"
	placement={side}
	panelClass={sharedClasses(p, 'Sheet')}
	enter={slide(side)}
	class={['sv-sheet', className]}
	bind:open
	bind:ref
/>
