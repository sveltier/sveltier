<script lang="ts">
	// A figure whose digits roll to the new value. See OdometerProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { numberFormat, useLocale } from '../../core/locale/locale.js';
	import '../../styles/visually-hidden.css';
	import type { AmountDefaults } from '../Amount/types.js';
	import { figureOptions, figureSegments } from '../Amount/format.js';
	import './odometer.css';
	import type { OdometerProps } from './types.js';

	let {
		value,
		format,
		decimals,
		masked,
		font,
		class: className,
		ref = $bindable(null),
		...rest
	}: OdometerProps = $props();

	// The figure follows Amount's defaults, so privacy mode hides it too and it takes the same face.
	const resolve = useDefaults<AmountDefaults>('Amount', {
		dimFraction: false,
		masked: false,
		font: 'data'
	});
	const p = $derived(resolve({ masked, font }));
	const hidden = $derived(p.masked);
	const locale = useLocale();

	const text = $derived(
		value == null
			? '—'
			: figureSegments(
					numberFormat(locale.locale, figureOptions(format, decimals, locale.currency)),
					value
				)
					.map((segment) => segment.text)
					.join('')
	);
	// Characters, kept by their place from the end, so a new leading digit leaves the others.
	const characters = $derived([...text]);
	const COLUMN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
</script>

<span
	bind:this={ref}
	{...rest}
	class={['sv-odometer', p.font === 'inherit' && 'sv-odometer--inherit', className]}
	>{#if hidden}<span aria-hidden="true">••••</span><span class="sv-visually-hidden"
			>{locale.t('amountHidden')}</span
		>{:else}<span class="sv-visually-hidden">{text}</span><span
			class="sv-odometer__figure"
			aria-hidden="true"
			>{#each characters as character, index (characters.length - index)}{#if /\d/.test(character)}<span
						class="sv-odometer__digit"
						><span class="sv-odometer__column" style:--sv-odometer-digit={character}
							>{#each COLUMN as digit (digit)}<span>{digit}</span>{/each}</span
						></span
					>{:else}<span class="sv-odometer__sign">{character}</span>{/if}{/each}</span
		>{/if}</span
>
