<script lang="ts">
	import {
		sharedClasses,
		useDefaults,
		type Color,
		type ComponentDefaults,
		type Size,
		type Variant
	} from '@sveltier/ui';

	interface Props {
		label: string;
		variant?: Variant;
		size?: Size;
		color?: Color;
	}

	let { label, variant, size, color }: Props = $props();

	const resolve = useDefaults<ComponentDefaults['Pill']>('Pill', {
		variant: 'tonal',
		size: 'sm',
		color: 'neutral'
	});
	// Every shared prop the component has, defaults included.
	const p = $derived(resolve({ variant, size, color }));
</script>

<span class={['pill', sharedClasses(p)]}>{label}</span>

<style>
	.pill {
		display: inline-grid;
		place-items: center;
		block-size: var(--sv-size-height);
		padding-inline: calc(var(--sv-size-height) * 0.382);
		border: var(--sv-hairline) solid var(--sv-variant-border);
		border-radius: var(--sv-radius-full);
		background: var(--sv-variant-bg);
		color: var(--sv-variant-fg);
		font-size: var(--sv-size-text);
	}
</style>
