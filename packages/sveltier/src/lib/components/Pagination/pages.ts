/** A page number, or a gap where numbers are left out. */
export type PageEntry = number | 'gap';

const range = (from: number, to: number): number[] =>
	Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);

/**
 * The entries of a pagination: `boundaries` numbers at each end, `siblings` on each side of
 * `page`, and gaps between. Away from the ends there are always as many entries, so the
 * controls do not move as the page changes.
 */
export function pageEntries(
	page: number,
	count: number,
	siblings: number,
	boundaries: number
): PageEntry[] {
	const start = range(1, Math.min(boundaries, count));
	const end = range(Math.max(count - boundaries + 1, boundaries + 1), count);
	const from = Math.max(
		Math.min(page - siblings, count - boundaries - siblings * 2 - 1),
		boundaries + 2
	);
	const to = Math.min(
		Math.max(page + siblings, boundaries + siblings * 2 + 2),
		end.length > 0 ? end[0]! - 2 : count - 1
	);
	// A gap that would hide a single number shows that number instead.
	const before: PageEntry[] =
		from > boundaries + 2 ? ['gap'] : boundaries + 1 < count - boundaries ? [boundaries + 1] : [];
	const after: PageEntry[] =
		to < count - boundaries - 1
			? ['gap']
			: count - boundaries > boundaries
				? [count - boundaries]
				: [];
	return [...start, ...before, ...range(from, to), ...after, ...end];
}
