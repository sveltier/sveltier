<script lang="ts">
	// A count or a dot on its content, or alone in a line. See BadgeProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../../styles/visually-hidden.css';
	import './badge.css';
	import type { BadgeDefaults, BadgeProps } from './types.js';

	let {
		color,
		max,
		content,
		dot = false,
		label,
		children,
		id,
		class: className,
		ref = $bindable(null),
		...rest
	}: BadgeProps = $props();

	const resolve = useDefaults<BadgeDefaults>('Badge', { color: 'primary', max: 99 });
	const p = $derived(resolve({ color, max }));

	const visible = $derived(dot || (content != null && content !== 0 && content !== ''));
	const shown = $derived(
		typeof content === 'number' && content > p.max ? `${p.max}+` : String(content ?? '')
	);
	// Screen readers hear the real count, with what it counts.
	const spoken = $derived(dot ? label : [content, label].filter((part) => part != null).join(' '));
</script>

<span
	bind:this={ref}
	{...rest}
	{id}
	class={['sv-badge', !children && 'sv-badge--inline', className]}
>
	{@render children?.()}
	{#if visible}
		<span class="sv-badge__anchor" aria-hidden="true">
			<span
				class={[
					'sv-badge__badge',
					sharedClasses({ variant: 'flat', color: p.color }),
					dot && 'sv-badge__badge--dot'
				]}>{dot ? '' : shown}</span
			>
		</span>
		<!-- With an id, the content can point at this text: aria-describedby="{id}-label". -->
		{#if spoken}<span class="sv-visually-hidden" id={id && `${id}-label`}>{spoken}</span>{/if}
	{/if}
</span>
