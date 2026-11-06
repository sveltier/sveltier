<script lang="ts">
	// A secret shown in part, with an optional reveal button. See SecureMaskProps for the props.
	import { useLocale } from '../../core/locale/locale.js';
	import '../../styles/visually-hidden.css';
	import Button from '../Button/Button.svelte';
	import './secure-mask.css';
	import type { SecureMaskProps } from './types.js';

	let {
		value,
		label,
		visible = 4,
		revealed = $bindable(false),
		toggle = false,
		hideAfter,
		class: className,
		ref = $bindable(null),
		...rest
	}: SecureMaskProps = $props();

	// An eye on a 24-unit grid, cut out with evenodd: its outline, the white and the pupil. Struck
	// through while the value shows, as the button then hides it.
	const EYE =
		'M12 5C7 5 3 8 1 12c2 4 6 7 11 7s9-3 11-7c-2-4-6-7-11-7zm0 2c3.8 0 6.9 2 8.7 5-1.8 3-4.9 5-8.7 5s-6.9-2-8.7-5C5.1 9 8.2 7 12 7zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z';
	const SLASH = 'M3.7 2.3 21.7 20.3 20.3 21.7 2.3 3.7z';

	const locale = useLocale();
	// Only these characters are ever written to the page while the value is masked.
	const last = $derived(visible > 0 ? value.slice(-visible) : '');

	// Hides the value again after a while; each reveal starts the wait again.
	$effect(() => {
		if (!revealed || hideAfter == null) return;
		const timer = setTimeout(() => (revealed = false), hideAfter);
		return () => clearTimeout(timer);
	});
</script>

<!-- Inline, so no whitespace between its parts. -->
<span
	bind:this={ref}
	{...rest}
	role="group"
	aria-label={label}
	class={['sv-secure-mask', className]}
	><span class="sv-secure-mask__value"
		>{#if revealed}{value}{:else}<span class="sv-secure-mask__dots" aria-hidden="true">••••</span
			>{#if last}<span aria-hidden="true">{last}</span><span class="sv-visually-hidden"
					>{locale.t('maskedEnding', { last })}</span
				>{:else}<span class="sv-visually-hidden">{locale.t('maskedValue')}</span>{/if}{/if}</span
	>{#if toggle}<Button
			icon
			variant="text"
			size="xs"
			class="sv-secure-mask__toggle"
			aria-label={locale.t('reveal')}
			aria-pressed={revealed}
			onclick={() => (revealed = !revealed)}
			><svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"
				><path d={EYE} />{#if revealed}<path d={SLASH} />{/if}</svg
			></Button
		>{/if}</span
>
