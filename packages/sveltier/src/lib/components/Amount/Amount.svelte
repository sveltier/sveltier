<script lang="ts">
	// A figure in the locale, with an optional flash on change. See AmountProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { numberFormat, useLocale } from '../../core/locale/locale.js';
	import { motion } from '../../primitives/motion/motion.js';
	import '../../styles/visually-hidden.css';
	import './amount.css';
	import { figureOptions, figureSegments } from './format.js';
	import type { AmountDefaults, AmountProps } from './types.js';

	let {
		dimFraction,
		masked,
		value,
		format,
		decimals,
		flash = false,
		class: className,
		ref = $bindable(null),
		...rest
	}: AmountProps = $props();

	const resolve = useDefaults<AmountDefaults>('Amount', { dimFraction: false, masked: false });
	const p = $derived(resolve({ dimFraction, masked }));
	const locale = useLocale();

	const segments = $derived(
		value == null
			? []
			: figureSegments(
					numberFormat(locale.locale, figureOptions(format, decimals, locale.currency)),
					value
				)
	);
	const text = $derived(segments.map((segment) => segment.text).join(''));

	// The overlay flashes the up or down colour when the value moves: not on the first render,
	// and not while masked, which would give the direction away.
	let shown: number | bigint | null | undefined;
	let mounted = false;
	function flashOnChange(overlay: HTMLSpanElement) {
		const current = value;
		const before = shown;
		shown = current;
		if (!mounted) {
			mounted = true;
			return;
		}
		if (p.masked || current == null || before == null || current === before) return;
		overlay.dataset.direction = current > before ? 'up' : 'down';
		const timing = motion(overlay);
		for (const animation of overlay.getAnimations()) animation.cancel();
		overlay.animate([{ opacity: 0.382 }, { opacity: 0 }], {
			duration: timing.slow * 1.618,
			easing: timing.ease
		});
	}
</script>

<!-- Inline, so no whitespace between its parts: a space would show before the figure. -->
<span bind:this={ref} {...rest} class={['sv-amount', className]}
	>{#if flash}<span class="sv-amount__flash" aria-hidden="true" {@attach flashOnChange}
		></span>{/if}{#if p.masked}<span aria-hidden="true">••••</span><span class="sv-visually-hidden"
			>{locale.t('amountHidden')}</span
		>{:else if value == null}—{:else if p.dimFraction}{#each segments as segment, i (i)}<span
				class={segment.dim ? 'sv-amount__fraction' : undefined}>{segment.text}</span
			>{/each}{:else}{text}{/if}</span
>
