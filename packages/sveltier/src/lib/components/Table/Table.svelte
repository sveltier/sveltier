<script lang="ts" generics="T">
	// Items in rows and columns, sortable by the headers. See TableProps for the props.
	import { checkValue, DEV, warnDuplicates, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../../styles/visually-hidden.css';
	import { compareValues } from './sort.js';
	import './table.css';
	import {
		SORT_DIRECTIONS,
		type TableAlign,
		type TableColumn,
		type TableDefaults,
		type TableProps,
		type TableSort
	} from './types.js';

	let {
		color,
		size,
		density,
		hover,
		items,
		columns,
		itemKey,
		sortBy = $bindable(),
		onsort,
		caption,
		loading = false,
		empty,
		rowAttributes,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		class: className,
		ref = $bindable(null),
		...rest
	}: TableProps<T> = $props();

	const resolve = useDefaults<TableDefaults>('Table', {
		color: 'primary',
		size: 'md',
		density: 'default',
		hover: false
	});
	const p = $derived(resolve({ color, size, density, hover }));
	const locale = useLocale();
	const id = $props.id();
	let table = $state<HTMLTableElement>();

	// Every column has a key or an id; with T still open, TypeScript cannot tell which one.
	const nameOf = (column: TableColumn<T>): string => (column.key ?? column.id) as string;
	// A key column reads the item; an id column computes its value, or has none beside its cell.
	const valueOf = (column: TableColumn<T>, item: T): unknown =>
		column.key === undefined ? column.value?.(item) : item[column.key as keyof T];

	// Numbers line up at the end unless the column says otherwise, read from its first value. A
	// reading is kept while there are no values, so a table that empties to load again holds still.
	const read: Record<string, TableAlign> = {};
	const aligns = $derived(
		columns.map((column): TableAlign => {
			if (column.align) return column.align;
			const name = nameOf(column);
			const item = items.find((item) => valueOf(column, item) != null);
			if (item === undefined) return read[name] ?? 'start';
			const value = valueOf(column, item);
			const align = typeof value === 'number' || typeof value === 'bigint' ? 'end' : 'start';
			read[name] = align;
			return align;
		})
	);

	const collator = $derived(new Intl.Collator(locale.locale, { numeric: true }));

	// The items in the order of the sorted column, empty values last either way.
	const rows = $derived.by(() => {
		const column =
			sortBy && columns.find((column) => column.sort && nameOf(column) === sortBy?.column);
		if (!column || !sortBy) return items;
		const sign = sortBy.direction === 'descending' ? -1 : 1;
		const { sort } = column;
		if (typeof sort === 'function') return [...items].sort((a, b) => sign * sort(a, b));
		return [...items].sort((a, b) => {
			const x = valueOf(column, a);
			const y = valueOf(column, b);
			if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1;
			return sign * compareValues(x, y, collator);
		});
	});

	// A header sorts ascending, then descending, then gives back the order of the items.
	function toggle(column: TableColumn<T>) {
		const name = nameOf(column);
		const next: TableSort | undefined =
			sortBy?.column !== name
				? { column: name, direction: 'ascending' }
				: sortBy.direction === 'ascending'
					? { column: name, direction: 'descending' }
					: undefined;
		sortBy = next;
		onsort?.(next);
	}

	// A table wider or taller than its box scrolls, so the box becomes a named region that
	// keyboard users can focus and scroll (WCAG 2.1.1).
	let scrollable = $state(false);
	function watchOverflow(node: HTMLDivElement) {
		const update = () => {
			scrollable = node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
		};
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (table) observer.observe(table);
		return () => observer.disconnect();
	}

	if (DEV) {
		$effect(() => {
			if (!caption) warnUnnamed('Table', table, 'a caption');
		});
		$effect(() =>
			warnDuplicates(
				'Table',
				'columns',
				columns.map(nameOf),
				'Give each column its own key, or an id with a value function for a computed one.'
			)
		);
		$effect(() => {
			if (!sortBy) return;
			const sortable = columns.filter((column) => column.sort).map(nameOf);
			checkValue('Table', 'sortBy.column', sortBy.column, sortable, 'Sort by a column with sort.');
			checkValue('Table', 'sortBy.direction', sortBy.direction, SORT_DIRECTIONS);
		});
	}
</script>

{#snippet content(column: TableColumn<T>, item: T)}
	{@const value = valueOf(column, item)}
	{#if column.cell}
		{@render column.cell(item)}
	{:else if value == null}
		—
	{:else}
		{column.format ? column.format(value as never, item) : String(value)}
	{/if}
{/snippet}

<!-- A region that scrolls takes focus so the keyboard can scroll it (WCAG 2.1.1). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={ref}
	{...rest}
	class={[
		'sv-table',
		sharedClasses(p, 'Table'),
		p.hover && 'sv-table--hover',
		loading && 'sv-table--loading',
		className
	]}
	role={scrollable ? 'region' : rest.role}
	tabindex={scrollable ? 0 : rest.tabindex}
	aria-label={scrollable ? ariaLabel : undefined}
	aria-labelledby={scrollable
		? (ariaLabelledby ?? (caption ? `${id}-caption` : undefined))
		: undefined}
	{@attach watchOverflow}
>
	{#if loading}
		<div class="sv-table__progress" aria-hidden="true"></div>
	{/if}
	<table
		bind:this={table}
		class="sv-table__table"
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby}
		aria-busy={loading || undefined}
	>
		{#if caption}
			<caption id="{id}-caption" class="sv-table__caption">{caption}</caption>
		{/if}
		<thead>
			<tr>
				<!-- Columns go by position: two with the same key get a warning, not a broken table. -->
				{#each columns as column, i (i)}
					{@const sorted = sortBy?.column === nameOf(column) ? sortBy.direction : undefined}
					<th
						scope="col"
						class={['sv-table__head', `sv-table__cell--${aligns[i]}`]}
						style:inline-size={column.width}
						aria-sort={column.sort ? sorted : undefined}
					>
						{#if column.sort}
							<button type="button" class="sv-table__sort" onclick={() => toggle(column)}>
								<span class={column.hideLabel ? 'sv-visually-hidden' : undefined}
									>{column.label}</span
								>
								<svg
									class="sv-table__arrow"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
								</svg>
							</button>
						{:else}
							<span class={column.hideLabel ? 'sv-visually-hidden' : undefined}>{column.label}</span
							>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as item (itemKey === undefined ? item : item[itemKey])}
				<tr {...rowAttributes?.(item)}>
					{#each columns as column, i (i)}
						<svelte:element
							this={column.rowHeader ? 'th' : 'td'}
							scope={column.rowHeader ? 'row' : undefined}
							class={[
								'sv-table__cell',
								`sv-table__cell--${aligns[i]}`,
								column.wrap && 'sv-table__cell--wrap'
							]}
						>
							{@render content(column, item)}
						</svelte:element>
					{/each}
				</tr>
			{:else}
				<tr>
					<td class="sv-table__empty" colspan={columns.length}>
						{#if loading}
							{locale.t('loading')}
						{:else if empty}
							{@render empty()}
						{:else}
							{locale.t('noData')}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
