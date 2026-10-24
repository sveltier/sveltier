<script lang="ts">
	// A row of a List: text, a link or a button. See ListItemProps for the props.
	import './list.css';
	import type { ListItemProps } from './types.js';

	let {
		title,
		subtitle,
		href,
		target,
		rel,
		onclick,
		active = false,
		disabled = false,
		prepend,
		append,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ListItemProps = $props();

	const tag = $derived(href != null ? 'a' : onclick ? 'button' : 'div');
</script>

<li
	bind:this={ref}
	{...rest}
	class={[
		'sv-list-item',
		active && 'sv-list-item--active',
		disabled && 'sv-list-item--disabled',
		className
	]}
>
	<svelte:element
		this={tag}
		class="sv-list-item__main"
		href={tag === 'a' && !disabled ? href : undefined}
		target={tag === 'a' ? target : undefined}
		rel={tag === 'a' ? rel : undefined}
		type={tag === 'button' ? 'button' : undefined}
		role={tag === 'a' && disabled ? 'link' : undefined}
		disabled={(tag === 'button' && disabled) || undefined}
		aria-disabled={(tag === 'a' && disabled) || undefined}
		aria-current={tag === 'a' && active ? 'page' : undefined}
		onclick={tag === 'button' ? onclick : undefined}
	>
		{#if prepend}<span class="sv-list-item__prepend">{@render prepend()}</span>{/if}
		<span class="sv-list-item__text">
			{#if title}<span class="sv-list-item__title">{title}</span>{/if}
			{#if subtitle}<span class="sv-list-item__subtitle">{subtitle}</span>{/if}
			{@render children?.()}
		</span>
	</svelte:element>
	{#if append}<span class="sv-list-item__append">{@render append()}</span>{/if}
</li>
