<script lang="ts">
	// A NumberField with buttons for shares of the maximum. See AmountInputProps for the props.
	import { stepAt } from '../../core/form/number.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Button from '../Button/Button.svelte';
	import NumberField from '../NumberField/NumberField.svelte';
	import './amount-input.css';
	import type { AmountInputProps } from './types.js';

	let {
		shares = [0.25, 0.5, 0.75, 1],
		max,
		step,
		id,
		disabled,
		readonly,
		density,
		value = $bindable(null),
		ref = $bindable(null),
		class: className,
		style,
		...rest
	}: AmountInputProps = $props();

	const locale = useLocale();
	const uid = $props.id();
	const inputId = $derived(id ?? uid);
	const places = (number: number) => (String(number).split('.')[1] ?? '').length;

	// A share of the maximum, rounded down to whole steps. A hair under a step from binary
	// rounding still counts as the step: 30% of 1 in steps of 0.1 is 0.3, not 0.2.
	function share(part: number) {
		if (max == null) return;
		const raw = max * part;
		const size = step == null ? undefined : stepAt(step, raw);
		value = size ? Number((Math.floor(raw / size + 1e-6) * size).toFixed(places(size))) : raw;
	}
</script>

<div class={['sv-amount-input', className]} {style}>
	<NumberField
		{...rest}
		id={inputId}
		{max}
		{step}
		{disabled}
		{readonly}
		{density}
		bind:value
		bind:ref
	/>
	{#if max != null && shares.length > 0}
		<div class="sv-amount-input__shares">
			{#each shares as part (part)}
				{@const percent = locale.formatPercent(part)}
				<Button
					variant="tonal"
					size="sm"
					{density}
					disabled={disabled || readonly}
					aria-controls={inputId}
					aria-label={locale.t('shareOfMax', { percent })}
					onclick={() => share(part)}
				>
					{percent}
				</Button>
			{/each}
		</div>
	{/if}
</div>
