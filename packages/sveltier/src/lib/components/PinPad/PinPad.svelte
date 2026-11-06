<script lang="ts">
	// A PIN entered on a keypad of its own. See PinPadProps for the props.
	import { onMount } from 'svelte';
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../../styles/visually-hidden.css';
	import './pin-pad.css';
	import type { PinPadDefaults, PinPadProps } from './types.js';

	let {
		color,
		size,
		disabled,
		label,
		value = $bindable(''),
		length = 6,
		oncomplete,
		error,
		name,
		shuffle = false,
		extra,
		id: idProp,
		class: className,
		ref = $bindable(null),
		...rest
	}: PinPadProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const resolve = useDefaults<PinPadDefaults>('PinPad', {
		color: 'primary',
		size: 'md',
		disabled: false
	});
	const p = $derived(resolve({ color, size, disabled }));
	const locale = useLocale();

	const DELETE =
		'M21 5H8.4L2 12l6.4 7H21zM19 7v10H9.3l-4.6-5 4.6-5zm-8.6 2.4L12 11l1.6-1.6 1.4 1.4-1.6 1.6 1.6 1.6-1.4 1.4-1.6-1.6-1.6 1.6-1.4-1.4 1.6-1.6-1.6-1.6z';

	// The phone layout, or a random order of the same digits once the pad is in the page.
	let digits = $state(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
	onMount(() => {
		if (!shuffle) return;
		const next = [...digits];
		const random = new Uint32Array(next.length);
		crypto.getRandomValues(random);
		for (let i = next.length - 1; i > 0; i--) {
			const j = random[i]! % (i + 1);
			[next[i], next[j]] = [next[j]!, next[i]!];
		}
		digits = next;
	});

	const entered = $derived(Math.min(value.length, length));

	function press(digit: string) {
		if (p.disabled || value.length >= length) return;
		value += digit;
		if (value.length === length) oncomplete?.(value);
	}

	function remove() {
		if (p.disabled) return;
		value = value.slice(0, -1);
	}

	// Safari does not focus a button that is clicked, so focus would stay outside the pad and the
	// keyboard would not reach it; the key takes focus itself.
	function focusKey(event: MouseEvent) {
		(event.currentTarget as HTMLButtonElement).focus({ preventScroll: true });
	}

	function keydown(event: KeyboardEvent) {
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		if (/^\d$/.test(event.key)) {
			event.preventDefault();
			press(event.key);
		} else if (event.key === 'Backspace') {
			event.preventDefault();
			remove();
		}
	}
</script>

<div
	bind:this={ref}
	{...rest}
	{id}
	role="group"
	aria-labelledby="{id}-label"
	aria-describedby={error ? `${id}-error` : undefined}
	class={[
		'sv-pin-pad',
		sharedClasses(p, 'PinPad'),
		error && 'sv-pin-pad--invalid',
		p.disabled && 'sv-pin-pad--disabled',
		className
	]}
	onkeydown={keydown}
>
	<div class="sv-pin-pad__label" id="{id}-label">{label}</div>
	<!-- Drawn again for each new error, so the dots shake once each time. -->
	{#key error}
		<div class={['sv-pin-pad__dots', error && 'sv-pin-pad__dots--shake']} aria-hidden="true">
			{#each { length }, index (index)}
				<span class={['sv-pin-pad__dot', index < entered && 'sv-pin-pad__dot--filled']}></span>
			{/each}
		</div>
	{/key}
	<div class="sv-visually-hidden" aria-live="polite">
		{locale.t('pinProgress', { count: entered, length })}
	</div>
	{#if error}<p class="sv-pin-pad__error" id="{id}-error">{error}</p>{/if}
	{#if name}<input type="hidden" {name} {value} />{/if}
	<div class="sv-pin-pad__keys">
		{#each digits.slice(0, 9) as digit (digit)}
			<button
				type="button"
				class="sv-pin-pad__key"
				disabled={p.disabled}
				onclick={(event) => {
					focusKey(event);
					press(digit);
				}}>{digit}</button
			>
		{/each}
		<div class="sv-pin-pad__extra">{@render extra?.()}</div>
		<button
			type="button"
			class="sv-pin-pad__key"
			disabled={p.disabled}
			onclick={(event) => {
				focusKey(event);
				press(digits[9]!);
			}}>{digits[9]}</button
		>
		<button
			type="button"
			class="sv-pin-pad__key sv-pin-pad__key--delete"
			aria-label={locale.t('pinDelete')}
			disabled={p.disabled || entered === 0}
			onclick={remove}
		>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={DELETE} /></svg>
		</button>
	</div>
</div>
