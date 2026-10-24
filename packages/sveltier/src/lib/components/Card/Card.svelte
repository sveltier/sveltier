<script lang="ts">
	// A surface with a header, content and actions. See CardProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './card.css';
	import type { CardDefaults, CardProps } from './types.js';

	let {
		variant,
		color,
		density,
		rounded,
		title,
		subtitle,
		level,
		prepend,
		append,
		actions,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: CardProps = $props();

	const resolve = useDefaults<CardDefaults>('Card', {
		variant: 'elevated',
		color: 'neutral',
		density: 'default',
		rounded: true
	});
	const p = $derived(resolve({ variant, color, density, rounded }));
</script>

<div bind:this={ref} {...rest} class={['sv-card', sharedClasses(p, 'Card'), className]}>
	{#if title || subtitle || prepend || append}
		<div class="sv-card__header">
			{#if prepend}<div class="sv-card__prepend">{@render prepend()}</div>{/if}
			{#if title || subtitle}
				<div class="sv-card__heading">
					{#if title}
						<svelte:element this={level ? `h${level}` : 'div'} class="sv-card__title">
							{title}
						</svelte:element>
					{/if}
					{#if subtitle}<div class="sv-card__subtitle">{subtitle}</div>{/if}
				</div>
			{/if}
			{#if append}<div class="sv-card__append">{@render append()}</div>{/if}
		</div>
	{/if}
	{@render children?.()}
	{#if actions}<div class="sv-card__actions">{@render actions()}</div>{/if}
</div>
