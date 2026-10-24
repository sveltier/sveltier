<script lang="ts">
	// A message with a type, a title, actions and a close button. See AlertProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './alert.css';
	import type { AlertDefaults, AlertProps } from './types.js';

	let {
		variant,
		color,
		density,
		rounded,
		type,
		title,
		icon = true,
		open = $bindable(true),
		closable = false,
		closeLabel,
		onclose,
		prepend,
		actions,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: AlertProps = $props();

	const resolve = useDefaults<AlertDefaults>('Alert', {
		variant: 'tonal',
		color: 'info',
		density: 'default',
		rounded: true
	});
	// A colour passed in wins over the type's.
	const p = $derived(resolve({ variant, color: color ?? type, density, rounded }));
	const locale = useLocale();

	// Circles, a triangle and their marks on a 24-unit grid, cut out with evenodd.
	const RING = 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zm0 2a7 7 0 1 1 0 14 7 7 0 1 1 0-14z';
	const ICONS = {
		info: `${RING}M11 7h2v2h-2zm0 3h2v7h-2z`,
		success: `${RING}M7.6 12.3 9 10.9l2 2 4-4 1.4 1.4-5.4 5.4z`,
		warning: 'M12 2.5 1.8 20.5h20.4zm0 4.1 6.7 11.9H5.3zM11 10h2v4h-2zm0 5h2v2h-2z',
		error: `${RING}M11 7h2v6h-2zm0 8h2v2h-2z`
	};
	const CLOSE =
		'M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z';

	function close() {
		open = false;
		onclose?.();
	}
</script>

{#if open}
	<div
		bind:this={ref}
		{...rest}
		role={type === 'warning' || type === 'error' ? 'alert' : 'status'}
		class={['sv-alert', sharedClasses(p), className]}
	>
		{#if prepend}
			<span class="sv-alert__icon">{@render prepend()}</span>
		{:else if icon && type}
			<span class="sv-alert__icon">
				<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
					<path d={ICONS[type]} />
				</svg>
			</span>
		{/if}
		<div class="sv-alert__content">
			{#if title}<div class="sv-alert__title">{title}</div>{/if}
			{#if children}<div>{@render children()}</div>{/if}
			{#if actions}<div class="sv-alert__actions">{@render actions()}</div>{/if}
		</div>
		{#if closable}
			<button
				type="button"
				class="sv-alert__close"
				aria-label={closeLabel ?? locale.t('close')}
				onclick={close}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={CLOSE} /></svg>
			</button>
		{/if}
	</div>
{/if}
