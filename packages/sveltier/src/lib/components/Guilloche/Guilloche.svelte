<script lang="ts" module>
	import { rosette, wave } from './curves.js';

	// The base curves, computed once for every Guilloche: they do not depend on the props.
	const ROSETTE = rosette();
	const WAVE = wave();
</script>

<script lang="ts">
	// The fine interlaced lines of a banknote, as decoration. See GuillocheProps for the props.
	import { checkValue, DEV } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { ROSETTE_SIZE, ROSETTE_SYMMETRY, WAVES_HEIGHT, WAVES_WIDTH } from './curves.js';
	import './guilloche.css';
	import { GUILLOCHE_PATTERNS, type GuillocheDefaults, type GuillocheProps } from './types.js';

	let {
		color,
		pattern = 'rosette',
		lines = 8,
		class: className,
		ref = $bindable(null),
		...rest
	}: GuillocheProps = $props();

	const uid = $props.id();
	const resolve = useDefaults<GuillocheDefaults>('Guilloche', { color: 'primary' });
	const p = $derived(resolve({ color }));
	const count = $derived(Math.max(1, Math.round(lines)));

	if (DEV) {
		$effect(() => checkValue('Guilloche', 'pattern', pattern, GUILLOCHE_PATTERNS));
	}
</script>

<svg
	bind:this={ref}
	{...rest}
	aria-hidden="true"
	focusable="false"
	preserveAspectRatio="xMidYMid slice"
	viewBox={pattern === 'waves'
		? `0 0 ${WAVES_WIDTH / 2} ${WAVES_HEIGHT}`
		: `0 0 ${ROSETTE_SIZE} ${ROSETTE_SIZE}`}
	class={['sv-guilloche', sharedClasses(p, 'Guilloche'), className]}
>
	<defs>
		<path id="{uid}-curve" d={pattern === 'waves' ? WAVE : ROSETTE} />
	</defs>
	{#each { length: count }, index (index)}
		{#if pattern === 'waves'}
			<!-- Bands down the box, each shifted along by its share of one period. -->
			<use
				href="#{uid}-curve"
				transform="translate({-((index / count) * (WAVES_WIDTH / 2))} {((index + 0.5) / count) *
					WAVES_HEIGHT})"
			/>
		{:else}
			<use
				href="#{uid}-curve"
				transform="rotate({(index / count) * (360 / ROSETTE_SYMMETRY)} {ROSETTE_SIZE /
					2} {ROSETTE_SIZE / 2})"
			/>
		{/if}
	{/each}
</svg>
