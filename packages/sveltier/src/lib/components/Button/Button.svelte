<script lang="ts">
	// A button, or a link styled as one. See ButtonProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './button.css';
	import type { ButtonDefaults, ButtonProps } from './types.js';

	let {
		variant,
		size,
		density,
		color,
		rounded,
		block,
		disabled,
		as,
		icon = false,
		loading = false,
		href,
		type,
		onclick,
		'aria-disabled': ariaDisabled,
		prepend,
		append,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ButtonProps = $props();

	const resolve = useDefaults<ButtonDefaults>('Button', {
		variant: 'flat',
		size: 'md',
		density: 'default',
		color: 'primary',
		rounded: true,
		block: false,
		disabled: false
	});
	const p = $derived(resolve({ variant, size, density, color, rounded, block, disabled }));
	const locale = useLocale();

	const link = $derived((as ?? (href == null ? 'button' : 'a')) === 'a');
	// Only a <button> can be disabled natively. A disabled link loses its href; a loading button
	// and one marked aria-disabled stay focusable. None of them takes presses.
	const native = $derived(!link && p.disabled);
	const inert = $derived(p.disabled || loading || ariaDisabled === true || ariaDisabled === 'true');

	function click(event: MouseEvent) {
		if (inert) event.preventDefault();
		else (onclick as ((event: MouseEvent) => void) | null | undefined)?.(event);
	}
</script>

<svelte:element
	this={link ? 'a' : 'button'}
	bind:this={ref}
	{...rest}
	href={link && !p.disabled ? href : undefined}
	type={link ? undefined : (type ?? 'button')}
	role={link && p.disabled ? 'link' : undefined}
	disabled={native || undefined}
	aria-disabled={(inert && !native) || undefined}
	class={[
		'sv-button',
		sharedClasses(p),
		inert && 'sv-button--inert',
		p.disabled && 'sv-button--disabled',
		p.block && 'sv-button--block',
		icon && 'sv-button--icon',
		loading && 'sv-button--loading',
		className
	]}
	onclick={click}
>
	{#if prepend}<span class="sv-button__prepend">{@render prepend()}</span>{/if}
	{@render children?.()}
	{#if append}<span class="sv-button__append">{@render append()}</span>{/if}
	{#if loading}
		<span class="sv-button__loader" aria-hidden="true"></span>
		<span class="sv-button__status">{locale.t('loading')}</span>
	{/if}
</svelte:element>
