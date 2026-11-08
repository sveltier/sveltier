/** One choice of a Select or a Combobox. */
export interface SelectOption<T extends string | number = string> {
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

/** @deprecated Renamed `SelectOption`, as Select and Combobox take `options`. */
export type SelectItem<T extends string | number = string> = SelectOption<T>;

/** The items with each group gathered where it first appears, the order the list shows. */
export function inGroupOrder<I extends { group?: string }>(items: readonly I[]): I[] {
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
export function edge(items: readonly { disabled?: boolean }[], end: 'first' | 'last'): number {
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
	items: readonly { disabled?: boolean }[],
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
	items: readonly SelectOption<string | number>[],
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
 * Whether every word of `query` appears in `text`, ignoring case and diacritics. An empty query
 * matches everything.
 */
export function matchesWords(text: string, query: string): boolean {
	const words = fold(query).split(/\s+/).filter(Boolean);
	if (words.length === 0) return true;
	const folded = fold(text);
	return words.every((word) => folded.includes(word));
}

/**
 * Whether every word of `query` appears in the item's label or description, ignoring case and
 * diacritics. An empty query matches everything.
 */
export function matchesQuery(item: SelectOption<string | number>, query: string): boolean {
	return matchesWords(`${item.label} ${item.description ?? ''}`, query);
}

/** Runs of items under the same group, in order, each item with its index in `items`. */
export function groupRuns<I extends { group?: string }>(
	items: readonly I[]
): Array<{ group?: string; entries: Array<{ item: I; index: number }> }> {
	const runs: Array<{ group?: string; entries: Array<{ item: I; index: number }> }> = [];
	items.forEach((item, index) => {
		const last = runs.at(-1);
		if (last && last.group === item.group) last.entries.push({ item, index });
		else runs.push({ group: item.group, entries: [{ item, index }] });
	});
	return runs;
}
