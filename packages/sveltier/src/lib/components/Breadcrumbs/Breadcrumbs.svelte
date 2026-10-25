<script lang="ts">
	// Where the current page sits in the site. See BreadcrumbsProps.
	import { useLocale } from '../../core/locale/locale.js';
	import './breadcrumbs.css';
	import type { BreadcrumbsProps } from './types.js';

	let {
		items,
		'aria-label': ariaLabel,
		class: className,
		ref = $bindable(null),
		...rest
	}: BreadcrumbsProps = $props();

	const locale = useLocale();
</script>

<nav
	bind:this={ref}
	aria-label={ariaLabel ?? locale.t('breadcrumb')}
	{...rest}
	class={['sv-breadcrumbs', className]}
>
	<ol class="sv-breadcrumbs__list">
		{#each items as item, index (index)}
			{@const current = index === items.length - 1 ? 'page' : undefined}
			<li class="sv-breadcrumbs__item">
				{#if item.href}
					<a class="sv-breadcrumbs__link" href={item.href} aria-current={current}>{item.label}</a>
				{:else}
					<span aria-current={current}>{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
