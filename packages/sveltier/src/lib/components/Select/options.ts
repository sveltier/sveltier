/** One choice of a Select or a Combobox. */
export interface SelectItem<T extends string | number = string> {
	/** What the field's value becomes. */
	value: T;
	/** What the option says, and what typing and filtering match. */
	label: string;
	/** A second line under the label, such as a venue or a code. Filtering matches it too. */
	description?: string;
	disabled?: boolean;
	/** The name of the group the option shows under. Groups show in the order they first appear. */
	group?: string;
}

/** The items with each group gathered where it first appears, the order the list shows. */
export function inGroupOrder<I extends SelectItem<string | number>>(items: readonly I[]): I[] {
	if (!items.some((item) => item.group !== undefined)) return [...items];
	const groups = new Map<string | undefined, I[]>();
	for (const item of items) {
		const run = groups.get(item.group);
		if (run) run.push(item);
		else groups.set(item.group, [item]);
	}
	return [...groups.values()].flat();
}

/** The index of the first or the last enabled item, or -1. */
export function edge(items: readonly SelectItem<string | number>[], end: 'first' | 'last'): number {
	if (end === 'first') return items.findIndex((item) => !item.disabled);
	for (let index = items.length - 1; index >= 0; index--) {
		if (!items[index]!.disabled) return index;
	}
	return -1;
}

/**
 * The enabled item `delta` items from `from`, skipping disabled ones and stopping at the ends:
 * the arrows move by 1, Page Up and Page Down by 10.
 */
export function moveBy(
	items: readonly SelectItem<string | number>[],
	from: number,
	delta: number
): number {
	if (from < 0) return edge(items, delta > 0 ? 'first' : 'last');
	const step = Math.sign(delta);
	let index = from;
	let last = from;
	for (let left = Math.abs(delta); left > 0;) {
		index += step;
		if (index < 0 || index >= items.length) break;
		if (items[index]!.disabled) continue;
		last = index;
		left--;
	}
	return last;
}

/**
 * The index of the next enabled item whose label starts with `search`, as typing does in a
 * list: a one-letter or repeated-letter search starts after `current` and cycles through the
 * items starting with that letter; a longer one may stay on `current`. -1 without a match.
 */
export function typeaheadIndex(
	items: readonly SelectItem<string | number>[],
	search: string,
	current: number
): number {
	const repeated = [...search].every((character) => character === search[0]);
	const term = (repeated ? search[0]! : search).toLowerCase();
	const from = term.length === 1 ? current + 1 : Math.max(current, 0);
	for (let offset = 0; offset < items.length; offset++) {
		const index = (from + offset) % items.length;
		const item = items[index]!;
		if (!item.disabled && item.label.trim().toLowerCase().startsWith(term)) return index;
	}
	return -1;
}

/** Text without case or diacritics, so "Hà Nội" and "ha noi" compare equal. */
export function fold(text: string): string {
	return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toLowerCase();
}

/**
 * Whether every word of `query` appears in the item's label or description, ignoring case and
 * diacritics. An empty query matches everything.
 */
export function matchesQuery(item: SelectItem<string | number>, query: string): boolean {
	const words = fold(query).split(/\s+/).filter(Boolean);
	if (words.length === 0) return true;
	const text = fold(`${item.label} ${item.description ?? ''}`);
	return words.every((word) => text.includes(word));
}
