<script lang="ts">
	// Every variant and colour, painted only through the shared-props variables.
	import {
		DENSITIES,
		INTENT_COLORS,
		SIZES,
		VARIANTS,
		sharedClasses,
		type Color,
		type Density,
		type Rounded,
		type Size
	} from '@sveltier/ui';
	import Segmented from '../Segmented.svelte';

	const COLORS: Color[] = [...INTENT_COLORS, 'neutral'];
	const ROUNDED = ['true', 'none', 'sm', 'lg', 'full'] as const;
	const options = <T extends string>(values: readonly T[]) =>
		values.map((value) => ({ value, label: value }));

	let size = $state<Size>('md');
	let density = $state<Density>('default');
	let rounded = $state<(typeof ROUNDED)[number]>('true');
	const radius = $derived<Rounded>(rounded === 'true' ? true : rounded);
</script>

<div class="docs-demo">
	<div class="docs-demo__controls">
		<Segmented
			label="Size"
			name="shared-size"
			options={options(SIZES)}
			value={size}
			onchange={(value) => (size = value)}
		/>
		<Segmented
			label="Density"
			name="shared-density"
			options={options(DENSITIES)}
			value={density}
			onchange={(value) => (density = value)}
		/>
		<Segmented
			label="Rounded"
			name="shared-rounded"
			options={options(ROUNDED)}
			value={rounded}
			onchange={(value) => (rounded = value)}
		/>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Variants and colours" tabindex="0">
		<table class="docs-specimens">
			<thead>
				<tr>
					<th scope="col"><span class="docs-visually-hidden">Variant</span></th>
					{#each COLORS as color (color)}
						<th scope="col">{color}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each VARIANTS as variant (variant)}
					<tr>
						<th scope="row">{variant}</th>
						{#each COLORS as color (color)}
							<td>
								<span
									class={[
										'docs-specimen',
										sharedClasses({ variant, color, size, density, rounded: radius })
									]}
								>
									Pay
								</span>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
