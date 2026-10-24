<script lang="ts">
	// A modal dialog in the middle of the screen, on the shared modal shell. See DialogProps.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { pop } from '../../primitives/motion/motion.js';
	import Modal from '../Modal/Modal.svelte';
	import type { DialogDefaults, DialogProps } from './types.js';

	let {
		size,
		density,
		rounded,
		open = $bindable(false),
		class: className,
		ref = $bindable(null),
		...rest
	}: DialogProps = $props();

	const resolve = useDefaults<DialogDefaults>('Dialog', {
		size: 'md',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ size, density, rounded }));
</script>

<Modal
	{...rest}
	component="Dialog"
	placement="center"
	panelClass={sharedClasses(p, 'Dialog')}
	enter={pop}
	class={['sv-dialog', className]}
	bind:open
	bind:ref
/>
