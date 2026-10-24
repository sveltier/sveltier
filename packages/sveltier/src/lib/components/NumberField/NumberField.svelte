<script lang="ts">
	// A number in a Field: typed in the locale's format, stepped with the keyboard or buttons, and
	// validated. See NumberFieldProps for the props.
	import { untrack } from 'svelte';
	import { checkValue, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { numberConstraintMessage, parseNumber } from '../../core/form/number.js';
	import type { Rule } from '../../core/form/types.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import './number-field.css';
	import type { NumberFieldDefaults, NumberFieldProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		value = $bindable(null),
		min,
		max,
		step,
		format,
		controls = true,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		readonly = false,
		name,
		prepend,
		append,
		id,
		'aria-describedby': describedBy,
		onkeydown,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: NumberFieldProps = $props();

	const resolve = useDefaults<NumberFieldDefaults>('NumberField', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();
	const uid = $props.id();
	const inputId = $derived(id ?? uid);

	/** The number written in the locale; empty for no number. */
	const show = (number: number | null) =>
		number === null || !Number.isFinite(number)
			? ''
			: locale.formatNumber(number, format ?? { maximumFractionDigits: 20 });

	// What the input shows, and what it means: a number, null for empty, NaN for not a number. A
	// form reset goes back to the text the field started with.
	const initial = untrack(() => show(value ?? null));
	let text = $state(initial);
	let parsed = $state<number | null>(untrack(() => value ?? null));

	// A value set from outside, not typed, is written in the locale format.
	$effect(() => {
		const next = value ?? null;
		if (
			!Object.is(
				next,
				untrack(() => parsed)
			)
		) {
			parsed = next;
			text = show(next);
		}
	});

	const field = createField<number | null>({
		value: () => parsed,
		empty: (number) => number === null,
		check: (number) => numberConstraintMessage(number, { required, min, max, step }, locale),
		// Rules never see an empty or unreadable value: the checks above stop those first.
		rules: () => rules as readonly Rule<number | null>[] | undefined,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) {
		$effect(() => {
			warnUnnamed('NumberField', ref);
			// A currency or percent sign in the field would make the text unreadable as a number.
			checkValue(
				'NumberField',
				'format.style',
				format?.style,
				['decimal'],
				'Put a currency or a unit in prepend or append.'
			);
		});
	}

	const places = (number: number | undefined) => (String(number ?? '').split('.')[1] ?? '').length;
	// The keys and buttons move by step, or by 1 when no step is set (and then any number is
	// valid). Enough decimals for the step and its starting point, so 0.1 + 0.2 lands on 0.3.
	const increment = $derived(step ?? 1);
	const decimals = $derived(Math.max(places(increment), places(min)));
	const inert = $derived(p.disabled || readonly);
	const current = $derived(parsed !== null && Number.isFinite(parsed) ? parsed : null);

	// Called for typing and for a form reset alike, so the value always follows the text.
	function read(next: string) {
		text = next;
		const number = parseNumber(next, locale.locale);
		parsed = number;
		if (number === null || Number.isFinite(number)) value = number;
	}

	/** Sets a number the keys or buttons chose, within min and max. */
	function commit(number: number) {
		const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, number));
		const next = Number(bounded.toFixed(decimals));
		parsed = next;
		value = next;
		text = show(next);
		field.changed();
	}

	// Moves along the steps counted from min, as a native number input does: from a value between
	// two steps, up goes to the next one and down to the previous one. Empty starts at min, or 0.
	function stepBy(steps: number) {
		if (inert) return;
		const start = min ?? 0;
		if (current === null) return commit(start);
		const offset = (current - start) / increment;
		const from = steps > 0 ? Math.floor(offset + 1e-9) : Math.ceil(offset - 1e-9);
		commit(start + (from + steps) * increment);
	}

	function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		(onkeydown as ((event: KeyboardEvent) => void) | null | undefined)?.(event);
		if (event.defaultPrevented || inert) return;
		const moves: Record<string, (() => void) | undefined> = {
			ArrowUp: () => stepBy(1),
			ArrowDown: () => stepBy(-1),
			PageUp: () => stepBy(10),
			PageDown: () => stepBy(-10),
			Home: min == null ? undefined : () => commit(min),
			End: max == null ? undefined : () => commit(max)
		};
		const move = moves[event.key];
		if (!move) return;
		event.preventDefault();
		move();
	}

	// Leaving means focus went outside the field, not to a button in it. The number is then
	// written in the locale format.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (root.contains(event.relatedTarget as Node | null)) return;
		if (current !== null) text = show(current);
		field.left();
	}

	// Only whole numbers, and no minus sign, can use the numeric keypad.
	const integer = $derived(step != null && decimals === 0);
</script>

{#snippet end()}
	{@render append?.()}
	{#if controls}
		<span class="sv-number-field__steps">
			<button
				type="button"
				class="sv-number-field__step"
				tabindex="-1"
				aria-label={locale.t('decrease')}
				aria-controls={inputId}
				disabled={inert || (min != null && current !== null && current <= min)}
				onpointerdown={(event) => event.preventDefault()}
				onclick={() => stepBy(-1)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
			</button>
			<button
				type="button"
				class="sv-number-field__step"
				tabindex="-1"
				aria-label={locale.t('increase')}
				aria-controls={inputId}
				disabled={inert || (max != null && current !== null && current >= max)}
				onpointerdown={(event) => event.preventDefault()}
				onclick={() => stepBy(1)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
			</button>
		</span>
	{/if}
{/snippet}

<Field
	{...p}
	id={inputId}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	append={controls || append ? end : undefined}
	class={['sv-number-field', className]}
	{style}
	oninput={field.changed}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<input
			bind:this={ref}
			defaultValue={initial}
			{...rest}
			{...attributes}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			type="text"
			role="spinbutton"
			inputmode={min != null && min >= 0 && integer ? 'numeric' : 'decimal'}
			autocomplete="off"
			aria-valuenow={current ?? undefined}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuetext={current === null ? undefined : text}
			bind:value={() => text, read}
			onkeydown={keydown}
		/>
		{#if name}<input type="hidden" {name} value={current ?? ''} />{/if}
	{/snippet}
</Field>
