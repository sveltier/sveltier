<script lang="ts">
	// The pages of a long list. See PaginationProps.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Button from '../Button/Button.svelte';
	import { pageEntries } from './pages.js';
	import './pagination.css';
	import type { PaginationDefaults, PaginationProps } from './types.js';

	let {
		color,
		size,
		density,
		siblings,
		boundaries,
		count,
		page = $bindable(1),
		href,
		onchange,
		'aria-label': ariaLabel,
		class: className,
		ref = $bindable(null),
		...rest
	}: PaginationProps = $props();

	const resolve = useDefaults<PaginationDefaults>('Pagination', {
		color: 'primary',
		size: 'sm',
		density: 'default',
		siblings: 1,
		boundaries: 1
	});
	const p = $derived(resolve({ color, size, density, siblings, boundaries }));
	const locale = useLocale();

	const total = $derived(Math.max(1, Math.floor(count)));
	const current = $derived(Math.min(Math.max(1, Math.floor(page)), total));
	const entries = $derived(pageEntries(current, total, p.siblings, p.boundaries));

	const PREVIOUS = 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z';
	const NEXT = 'M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6z';

	// A link still navigates; the value follows at once.
	function go(target: number) {
		if (target === current || target < 1 || target > total) return;
		page = target;
		onchange?.(target);
	}
</script>

{#snippet step(target: number, label: string, path: string)}
	<li>
		<Button
			href={href?.(target)}
			icon
			variant="text"
			color="neutral"
			size={p.size}
			density={p.density}
			disabled={target < 1 || target > total}
			aria-label={label}
			class="sv-pagination__step"
			onclick={() => go(target)}
		>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
		</Button>
	</li>
{/snippet}

<nav
	bind:this={ref}
	aria-label={ariaLabel ?? locale.t('pagination')}
	{...rest}
	class={['sv-pagination', className]}
>
	<ul class="sv-pagination__list">
		{@render step(current - 1, locale.t('previous'), PREVIOUS)}
		{#each entries as entry, index (typeof entry === 'number' ? entry : `gap-${index}`)}
			{#if entry === 'gap'}
				<li class="sv-pagination__gap" aria-hidden="true">…</li>
			{:else}
				<li>
					<Button
						href={href?.(entry)}
						variant={entry === current ? 'flat' : 'text'}
						color={entry === current ? p.color : 'neutral'}
						size={p.size}
						density={p.density}
						aria-label={locale.t('page', { page: entry })}
						aria-current={entry === current ? 'page' : undefined}
						class="sv-pagination__page"
						onclick={() => go(entry)}
					>
						{entry}
					</Button>
				</li>
			{/if}
		{/each}
		{@render step(current + 1, locale.t('next'), NEXT)}
	</ul>
</nav>
