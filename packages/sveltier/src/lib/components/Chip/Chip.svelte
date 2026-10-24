<script lang="ts">
	// A tag, a filter, an action or a link, as a compact pill. See ChipProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sveltierError } from '../../core/errors/errors.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './chip.css';
	import type { ChipDefaults, ChipProps } from './types.js';

	let {
		variant,
		size,
		density,
		color,
		rounded,
		disabled,
		selected = $bindable(),
		closable = false,
		closeLabel,
		onclose,
		href,
		onclick,
		prepend,
		append,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ChipProps = $props();

	const resolve = useDefaults<ChipDefaults>('Chip', {
		variant: 'tonal',
		size: 'sm',
		density: 'default',
		color: 'neutral',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, size, density, color, rounded, disabled }));
	const locale = useLocale();

	const toggle = $derived(selected !== undefined);
	const tag = $derived.by(() => {
		const element = href != null ? 'a' : toggle || onclick ? 'button' : 'span';
		// A close button inside a button or a link would nest one control in another.
		if (closable && element !== 'span') {
			throw sveltierError(
				'SV4001',
				'Chip: a closable chip cannot also be a button or a link, since its close button would sit inside it. Put the action in a Button next to the chip.'
			);
		}
		return element;
	});
	const action = $derived(tag !== 'span');

	function click(event: MouseEvent) {
		if (p.disabled) {
			event.preventDefault();
			return;
		}
		if (toggle) selected = !selected;
		(onclick as ((event: MouseEvent) => void) | null | undefined)?.(event);
	}

	const CHECK = 'M4 12.5 5.5 11l4 4 9-9L20 7.5 9.5 18z';
	const CLOSE =
		'M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z';
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	{...rest}
	href={tag === 'a' && !p.disabled ? href : undefined}
	type={tag === 'button' ? 'button' : undefined}
	role={tag === 'a' && p.disabled ? 'link' : undefined}
	disabled={(tag === 'button' && p.disabled) || undefined}
	aria-disabled={(tag === 'a' && p.disabled) || undefined}
	aria-pressed={toggle ? selected : undefined}
	class={[
		'sv-chip',
		sharedClasses({ ...p, variant: selected ? 'flat' : p.variant }, 'Chip'),
		action && 'sv-chip--action',
		p.disabled && 'sv-chip--disabled',
		className
	]}
	onclick={action ? click : undefined}
>
	{#if selected}
		<span class="sv-chip__prepend">
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={CHECK} /></svg>
		</span>
	{:else if prepend}
		<span class="sv-chip__prepend">{@render prepend()}</span>
	{/if}
	{#if children}<span class="sv-chip__label">{@render children()}</span>{/if}
	{#if append}<span class="sv-chip__append">{@render append()}</span>{/if}
	{#if closable}
		<button
			type="button"
			class="sv-chip__close"
			aria-label={closeLabel ?? locale.t('close')}
			disabled={p.disabled}
			onclick={() => onclose?.()}
		>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={CLOSE} /></svg>
		</button>
	{/if}
</svelte:element>
