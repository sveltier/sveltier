<script lang="ts">
	import { useDefaults, type Color, type ComponentDefaults, type Size } from '@sveltier/ui';

	interface Props {
		value: number;
		size?: Size;
		color?: Color;
		showSign?: boolean;
	}

	// No fallbacks in the destructuring: a fallback would hide the provider's defaults.
	let { value, size, color, showSign }: Props = $props();

	const resolve = useDefaults<ComponentDefaults['PriceTag']>('PriceTag', {
		size: 'md',
		color: 'neutral',
		showSign: true
	});
	const p = $derived(resolve({ size, color, showSign }));
</script>

<span class="price-tag price-tag--{p.size}">
	{p.showSign && value > 0 ? '+' : ''}{value}
</span>
