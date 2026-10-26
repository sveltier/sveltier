/**
 * Orders two cell values: numbers and big integers by size, dates by time, `false` before
 * `true`, and anything else as text in the collator's order. Values of different kinds compare
 * as text. Empty values are the caller's to place.
 */
export function compareValues(a: unknown, b: unknown, collator: Intl.Collator): number {
	if (
		(typeof a === 'number' || typeof a === 'bigint') &&
		(typeof b === 'number' || typeof b === 'bigint')
	) {
		return a < b ? -1 : a > b ? 1 : 0;
	}
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
	return collator.compare(String(a), String(b));
}
