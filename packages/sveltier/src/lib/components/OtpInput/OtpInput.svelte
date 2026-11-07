<script lang="ts">
	// A one-time code: one input lying over a row of boxes that show its characters. See
	// OtpInputProps for the props.
	import { untrack } from 'svelte';
	import { checkValue, DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './otp-input.css';
	import { OTP_TYPES, type OtpInputDefaults, type OtpInputProps } from './types.js';

	let {
		color,
		size,
		density,
		rounded,
		disabled,
		value = $bindable(''),
		onchange,
		length = 6,
		type = 'numeric',
		oncomplete,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		id: idProp,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: OtpInputProps = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
	const resolve = useDefaults<OtpInputDefaults>('OtpInput', {
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ color, size, density, rounded, disabled }));
	const locale = useLocale();

	// Characters outside the type are dropped, letters are uppercased, and the code is cut to
	// its length: a pasted "123-456" or "abc 123" becomes a code.
	const clean = (text: string) =>
		(type === 'numeric'
			? text.replace(/\D/g, '')
			: text.replace(/[^a-z\d]/gi, '').toUpperCase()
		).slice(0, length);

	const code = $derived(clean(value ?? ''));
	// A form reset goes back to the code the field started with.
	const initial = untrack(() => code);
	let focused = $state(false);
	// The complete code oncomplete last ran with, or '' while the code is short: it runs once per
	// fill, and again for a different code pasted over a full one.
	let completed = untrack(() => (code.length === length ? code : ''));

	const field = createField<string>({
		value: () => code,
		empty: (text) => text === '',
		check: (text) => {
			if (text === '') return required ? locale.t('required') : undefined;
			return text.length < length ? locale.t('otpIncomplete', { length }) : undefined;
		},
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	const message = $derived(typeof field.error === 'string' ? field.error : undefined);
	// The box the next character goes in, or the last one once the code is full.
	const active = $derived(focused ? Math.min(code.length, length - 1) : -1);

	if (DEV) {
		$effect(() => {
			checkValue('OtpInput', 'type', type, OTP_TYPES);
			warnUnnamed('OtpInput', ref);
		});
	}

	// The caret stays at the end, so the boxes fill in order and Backspace takes the last one. A
	// selection is left alone, so select all and Delete, or a paste over it, replaces the code.
	function toEnd() {
		if (!ref || document.activeElement !== ref || ref.selectionStart !== ref.selectionEnd) return;
		const end = ref.value.length;
		ref.setSelectionRange(end, end);
	}

	function write(next: string) {
		const cleaned = clean(next);
		value = cleaned;
		// A dropped character never reached the state, so the input is put right by hand.
		if (ref && ref.value !== cleaned) ref.value = cleaned;
	}

	function input() {
		field.changed();
		toEnd();
		const done = code.length === length ? code : '';
		if (done && done !== completed) oncomplete?.(done);
		completed = done;
	}
</script>

<div
	class={[
		'sv-otp-input',
		sharedClasses(p, 'OtpInput'),
		field.error !== false && 'sv-otp-input--invalid',
		p.disabled && 'sv-otp-input--disabled',
		className
	]}
	{style}
	style:--sv-otp-length={length}
>
	{#if label}
		<label class="sv-otp-input__label" for={id}
			>{label}{#if required}<span class="sv-otp-input__required" aria-hidden="true">*</span
				>{/if}</label
		>
	{/if}
	<!-- The input's own events, heard as they bubble, so the app's handlers on it still run. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="sv-otp-input__code"
		oninput={input}
		onchange={() => onchange?.(value ?? '')}
		onfocusin={() => {
			focused = true;
			toEnd();
		}}
		onfocusout={() => {
			focused = false;
			field.left();
		}}
		onpointerup={toEnd}
		onkeyup={toEnd}
	>
		<!-- Shown for sight; screen readers hear the input's own value. -->
		{#each { length }, index (index)}
			<span
				class={[
					'sv-otp-input__box',
					index < code.length && 'sv-otp-input__box--filled',
					index === active && 'sv-otp-input__box--active'
				]}
				aria-hidden="true">{code[index] ?? ''}</span
			>
		{/each}
		<input
			bind:this={ref}
			defaultValue={initial}
			autocomplete="one-time-code"
			{...rest}
			{id}
			type="text"
			class="sv-otp-input__input"
			inputmode={type === 'numeric' ? 'numeric' : 'text'}
			autocapitalize={type === 'numeric' ? 'off' : 'characters'}
			autocorrect="off"
			spellcheck={false}
			{required}
			disabled={p.disabled}
			aria-describedby={[describedBy, message ? `${id}-error` : hint ? `${id}-hint` : undefined]
				.filter(Boolean)
				.join(' ') || undefined}
			aria-invalid={field.error !== false || undefined}
			bind:value={() => code, write}
		/>
	</div>
	{#if hint && !message}<p class="sv-otp-input__hint" id="{id}-hint">{hint}</p>{/if}
	<!-- Announces an error that appears after the user has moved on. -->
	<div aria-live="polite">
		{#if message}<p class="sv-otp-input__error" id="{id}-error">{message}</p>{/if}
	</div>
</div>
